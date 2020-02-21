const Rq = require("../models/request-upgrade");
const Notify = require("../models/notify");
const nodemailer = require("nodemailer");
const User = require("../models/users");

module.exports.requestRelatedRequestId = (req, res, next, id) => {
    console.log("here", id)
    Rq
    .findById(id)
    .exec( (err, rq) => {
        if(err || !rq) {
            return res.status(404).json( {message: "error occur - 404 request"} );
        }
        req.rqInfo = rq;
        next();
    });
}

module.exports.getRequestUpgradeToSpecialAccount = (req, res) => {
    Rq
    .find({})
    .sort([["created", -1]])
    .populate("owner", "_id fullname email photo")
    .exec( (err, rqs) => {
        if(err || !rqs) return res.status(400).json( {message: "Error occur - get all reuqest upgrade to special account"} );
        return res.status(200).json(rqs);
    })
}

module.exports.postAccecptRequestUpgradeToSpecialAccount = (req, res) => {
    let rq = req.rqInfo;
    rq.status = 1;
    rq.statusString = "Accepted";

    try {
        let { photo, name, receiver, owner, content } = req.body;
        content = !content ? `Congratulation!, your request was approve. To write announcements for who was following you, you must verify ${rq.email}. We were sent a link contain active code, check it now.` : content;
        let ntf = new Notify();
        ntf.photo = photo;
        ntf.receiver = receiver
        ntf.name = name;
        ntf.owner = owner;
        ntf.content = content;

        let randomActiveCode =  Math.random().toString(36).substring(7) + new Date().getTime();
        rq.activeCode = randomActiveCode;
        rq.modified = Date.now();
        let activeLink = process.env.REACT_APP_CLIENT_URL + "/upgrade-account/" + randomActiveCode;
        

        rq.save( (err, result) => {
            if(err) return res.status(400).json( {message: "error occur - update accept request"} );
            ntf.save( (err, result) => {
                if(err) return res.status(400).json( {message: "error occur - handle accept request"});
                // Send mail
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.user_mail,
                        pass: process.env.pass_mail
                    }
                });

                let mailOptions = {
                    from: 'Blackblue',
                    to: rq.email,
                    subject: `Upgrade account`,
                    html: `
                        <a href='${activeLink}'>Click here to active account</a>
                    `
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        
                    }
                    // return res.json( {message: "Request sent"} );
                    return res.status(200).json( {ntf, message: "Accepted"} )
                });
            });
        })
    } catch(err) {
        console.log(err);
        return res.json( {message: "Error occur - post accept rq"} )
    }
}

module.exports.postRejectRequestUpgradeToSpecialAccount = (req, res) => {
    let rq = req.rqInfo;
    rq.status = 3;
    rq.statusString = "Rejected";

    let { photo, name, receiver, owner, content } = req.body;
    content = !content ? `Unfortunately, we weren't albe to approve your request update to special account submitted on ${new Date(rq.created).toDateString()} for ${rq.email}` : content;
    let ntf = new Notify();
    ntf.photo = photo;
    ntf.receiver = receiver
    ntf.name = name;
    ntf.owner = owner;
    ntf.content = content;


    rq.save( (err, result) => {
        if(err) return res.status(400).json( {message: "error occur - update reject request"} );
        ntf.save( (err, result) => {
            if(err) return res.status(400).json( {message: "error occur - notify reject request"});
            return res.status(200).json( {ntf, message: "Rejected"} )
        });
    })

}

module.exports.getVerifyRequestUpgradeToSpecialAccount = (req, res) => {
    console.log(req.query);
    let { vfc } = req.query;
    try {
        Rq
        .findOne( {activeCode: vfc} )
        .exec( (err, rq) => {
            if(err || !rq) return res.status(200).json( {message: "Request not found"} );
            rq.status = 2;
            rq.statusString = "Verified";
            rq.activeCode = "";
            rq.modified = Date.now();
            
            rq.save( (err, result) => {
                if(err || ! result) return res.status(400).json( {message: "Error occur - cannot verified request "} );

                User.findOne({email: result.email}, "_id roles", (err, user) => {
                    if(err) return res.status(400).json( {message: "User not found"} );
                    user.roles = "5d9195581e2c742f49191e0b";
                    user.save( (err, result) => {
                        if(err) return res.status(400).json( {message: "Can not modify this user"} );
                        // return res.status(200).json( {message: `Permission Changed`} );
                        let ntf = new Notify();
                        ntf.receiver = rq.owner;
                        ntf.content = `Congratilation, your request for ${rq.email} was verified. Please logout that email to make sure it was changed`;
                        ntf.save( (err, ntfResult) => {
                            return res.status(200).json( {message: "Request verified", ntf: ntfResult} );
                        })
                    });
                })

                
            })
        })
    } catch (err) {
        console.log(err);
        return res.json( {message: "Error occur - get vefiry rq"} );
    }

}
const Acm = require("../models/announcements");
const User = require("../models/users");
const nodemailer = require("nodemailer");
const { getTagIds } = require("../utilities/helper");


module.exports.postAnnouncement = (req, res) => {
    /**
     * anonymous tag?
     * 1. Select all tags from database and check exist tag in client side (> 1000 tags?) 
     * 2. Check anonymous tags in server side 
     * 3. Check anonymous tags in server side. If exist -> add post with that tag
     *                                         If not -> Add a new tag with that name then add post with that tag
     **/ 

    const { title, body, isImportant, tagsnameArray, id, name } = req.body;
    let tagsNeedToReference = [];

    Promise.all(
        tagsnameArray.map( async tag => {
            let data = await getTagIds(tag);
            tagsNeedToReference = [...tagsNeedToReference, data];
        })
    )
    .then( () => {
        Acm.findOne( {title}, "_id", (err, result) => {
            if(!result) {
                const acm = new Acm( {title, body, isImportant, anonymousTags: tagsnameArray, owner: id} );
                tagsNeedToReference.map( t => acm.tags.push(t._id));
                acm.save( (err, result) => {
                    if(err) return res.status(400).json( {message: "Error occur"} );
                    // return res.status(200).json( {message: "Done", payload: result} );
    
                    // Mail list
                    User
                    .findById(id, "_id  followers")
                    .populate("followers", "email")
                    .exec( (err, emails) => {
                        if(err) return res.status(400).json( {message: "Can't send mail"} )
                        console.log(emails)
                        let list = [];
                        emails.followers.map(em => list.push(em.email));
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
                            to: list,
                            subject: `New announcement from ${name}`,
                            html: `<a href="${process.env.REACT_APP_CLIENT_URL}/announcements/${result._id}?ow=${id}">${title}</a>`
                        };
    
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                
                            }
                            return res.json( {message: "Request sent"} );
                        });
                    })
                })
                
            } else {
                return res.status(200).json( {message: "Announcement exits"} );
            }
        })
    })

    
}

module.exports.getAnnouncements = (req, res) => {
    // Acm.find({}, null, {sort: {created: -1}}, (err, acms) => {
    //     if(err) return res.status(400).json( {message: "Error occur"} );
    //     return res.status(200).json( {message: `${acms.length} loaded`, payload: acms});
    // });

    Acm
    .find({})
    .populate("tags", "_id name description count")
    .sort([["created", -1]])
    .exec( (err, acms) => {
        if(err) return res.status(400).json( {message: "Error occur"} );
        return res.status(200).json( {message: `${acms.length} loaded`, payload: acms});
    });
}

module.exports.getAnnouncementsFromSeperateUser = (req, res) => {

    let { userId } = req.params;
    console.log("sdfsdfsdf",userId)
    User
    .findById(userId, "following")
    .populate("following", "_id")
    .exec( (err, user) => {
        if(err) return res.status(400).json( {message: "Error occur - get user's following"} );
        let flwId = [];
        user.following.map( fl => flwId.push(String(fl._id)) );

        Acm
        .find({
            $or: [
                { owner: {$in: flwId} },
                { owner: userId }
            ]
        })
        .populate("tags", "_id name count descritpion")
        .exec( (err, acms) => {
            return res.status(200).json( {message: `${acms.length} loaded`, payload: acms} );
        });
    })
}

module.exports.requestRelatedAcmId = async (req, res, next, id) => {
    console.log(req.query)
    const { uid } = req.query;
    await Acm
    .findById(id)
    .populate("tags", "_id name description count")
    .exec( (err, acm) => {
        if(err || !acm) return res.status(400).json( {message: "Error occur 123"} );

        User
        .findById(uid, "_id following")
        .exec( (err, flw) => {
            if(err || !flw) return res.status(400).json( {message: "Error occur 123"} );
            if(uid == acm.owner || flw.following.indexOf(acm.owner) !== -1) {
                req.acmInfo = acm;
                next();
            } else {
                res.status(400).json( {message: "Error occur 123"} );
            }
        })
    })
}

module.exports.getSingleAcm = (req, res) => {
    return res.status(200).json(req.acmInfo);
}

module.exports.putEditAcm = (req, res) => {
    let { title, body, isImportant, tagsnameArray } = req.body;
    let acm = req.acmInfo;
    if(body) acm.body = body;
    acm.title = title;
    acm.isImportant = isImportant;
    acm.anonymousTags = tagsnameArray;
    
    acm.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (edit acm)", status: 400} );
        return res.status(200).json( {message: "Done", status: 200, payload: result} );
    });
}

module.exports.deleteEditAcm = (req, res) => {
    let acm = req.acmInfo;
    acm.remove( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (delete acm)"} );
        return res.status(200).json( {message: "Done"} );
    });
}
const User = require("../models/users");
const Privileges = require("../models/privileges");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const nodemailer = require("nodemailer");

module.exports.postSignup = (req, res) => {
    const { email, password } = req.body;
    User.findOne( { email }, (err, user) => {
        if(err || user) {
            res.status(400).json( {message: `User with that email was exist`} );
        } else {
            let user = new User();
            user.email = email;
            user.password = password;
            user.save( (err, obj) => {
                if(err) {
                    return res.status(400).json( {message: `Error occur when create user, please try again`} );
                }
                user.salt = undefined;
                user.hashed_password = undefined;
                return res.status(200).json( {message: 'Congratulation! Signup sucessfully', payload: user} )
            })
        }
    })
}

module.exports.postSignin = (req, res) => {
    const { email, password } = req.body;

    User.findOne( {email} )
    .select("_id email hashed_password salt fullname photo")
    .populate("roles", "permission")
    .exec( (err, user) => {
        if(err || !user) {
            return res.status(400).json( {message: "User with that email is not exist"} )
        } else {
            console.log(user);
            if(user.authenticate(password)) {
                user.hashed_password = undefined;
                user.salt = undefined;

                const token = jwt.sign( {_id: user._id, roles: user.roles.permission}, process.env.JWT_SECRET );
                user.roles._id = undefined;
                res.cookie('token', token, {maxAge: 900000} );
                const payload = {token, user}
                return res.status(200).json( {message: "Signin successfully", payload} );
            } else {
                return res.status(400).json( {message: "Password do not match"} )
            }
        }
    })
}

module.exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
})

module.exports.isAdmin = (req, res, next) => {
    console.log(req.payload)
    req.payload && Number(req.payload.roles) === 7 ? next() : res.status(403).json( {message: 'Permission deny'} );
}

module.exports.isCanWriteAcm = (req, res, next) => {
    console.log(req.payload)
    req.payload && Number(req.payload.roles) >= 1 ? next() : res.status(403).json( {message: "Permission deny"} ); 
}

module.exports.yourAreAdmin = (req, res) => {
    return res.status(200).json( {message: 'admin'} );
}

module.exports.getSignout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json( {message: 'Signout success'} );   
}

module.exports.postPrivileges = (req, res) => {
    let { name, permission, description } = req.body;
    Privileges.findOne({name, permission}, (err, pri) => {
        if(!pri) {
            let privileges = new Privileges({name, permission, description});
            privileges.save( (err, result) => {
                if(err) return res.status(400).json( {message: 'Error occur'} )
                return res.status(200).json( {message: 'Done', payload: privileges} );
            })
        } else {
            return res.status(400).json( {message: "Privilege name was exist"} );
        }
    })
    
}

module.exports.forgotPassword = (req, res) => {
    let email = req.query.email;
    User.findOne( {email}, "_id", (err, user) => {
        if(err || !user) return res.json( {message: "Request sent"} );

        // let newPassword = Math.random().toString(36).slice(-8);
        let randomResetCode =  Math.random().toString(36).substring(7) + new Date().getTime();
        let resetLink = process.env.REACT_APP_CLIENT_URL + "/auth/reset-password/" + randomResetCode;
        user.resetCode = randomResetCode;
        user.save( (err, result) => {
            if(err) return res.json( {message: "Error occur (set reset password code)"} );

            // Send mail
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.user_mail,
                    pass: process.env.pass_mail
                }
            });

            let bodyMail = `<p>Hello little girl, how the fuck you forgot your password?</p>
                <a href="${resetLink}">Click the following link to reset your password</a>`;

            let mailOptions = {
                from: 'Blackblue',
                to: email,
                subject: 'Reset your password',
                html: bodyMail
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

}

module.exports.resetPassword = (req, res) => {
    let { resetCode, pwd } = req.body;
    User
    .findOne( {resetCode} )
    .exec( (err, result) => {
        if(err || !result) return res.status(400).json( {message: "Reset code was expired"} )
        result.resetCode = "";
        result.setPassword(pwd);
        result.save( (err, rs) => {
            if(err) return res.status(400).json( {message: "Error occur - save reset password"} );
            return res.status(200).json( {message: "Change password successfully"} );
        });
    }); 
}
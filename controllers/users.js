const User = require("../models/users");
const Privilege = require("../models/privileges");
const RqUpgrade = require("../models/request-upgrade");
const formidable = require("formidable");
const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

module.exports.getUsers = (req, res) => {
    User.find( {}, (err, users) => {
        if(err) return res.status(400).json( {message: "Error occur"} );
        return res.status(200).json(users);
    });
}

module.exports.getUsersExceptLoggedOnUser = (req, res) => {
    let { uid } = req.params;
    User
    .find({
        _id: { $nin: uid }
    },
    {
        sort: -1
    })
    .select("_id fullname email photo followers")
    .exec( (err, users) => {
        if(err || !users) return res.status(400).json( {message: "error occur - get users except logged on user"} );
        return res.status(200).json(users);
    })
}

module.exports.adminGetUsersExceptLoggedOnUser = (req, res) => {
    let { uid } = req.params;
    console.log(uid, "**************===")
    User
    .find({
        _id: { $nin: uid }
    },
    {
        sort: -1
    })
    .select("_id fullname email following followers photo roles")
    .populate("roles", "_id permission")
    .exec( (err, users) => {
        if(err || !users) return res.status(400).json( {message: "error occur - admin get users except logged on user"} );
        return res.status(200).json(users);
    })
}

module.exports.getSingleUser = (req, res) => {
    req.userPayload.hashed_password = undefined;
    req.userPayload.salt = undefined;
    return res.status(200).json(req.userPayload)
}

module.exports.getInfoLoggedUser = (req, res) => {
    if(req.payload._id == req.userPayload._id) {
        req.userPayload.hashed_password = undefined;
        req.userPayload.salt = undefined;
        return res.json( req.userPayload )
    } else {
        return res.status(404).json( {message: 404} );
    }
}

module.exports.requrestRelatedUserId = async (req, res, next, id) => {
    try {
        await User.findOne({_id: id})
        .populate("following", "_id fullname email")
        .populate("followers", "_id fullname email")
        .exec( (err, user) => {
            if(err || !user) {
                console.log("reject", err)
                return res.status(404).json( {message: "404"} );
            } else {
                req.userPayload = user;
                next();
            }
        })
    } catch (err) {
        return res.status(404).json( {message: "404"} );
    }
}

module.exports.updateStoryUser = (req, res) => {
    let user = req.userPayload;
    console.log(req.body)
    let { bioUpdate, fquotes } = req.body;
    user.bio = bioUpdate;
    user.quotes = fquotes;

    user.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur when update story user, please try again"} );
        return res.status(200).json( {message: "Story updated"} );
    })
}

module.exports.updateInfoUser = (req, res) => {
    let user = req.userPayload;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    console.log("parse");
    form.parse(req, function(err, fields, files) {
        console.log(fields)
        const { id, fullname, currentPassword } = fields;
        console.log(files.photo);
        if(user.authenticate(currentPassword)) {
            user.fullname = fullname;
            if(files.photo) {
                
                if(user.photo) {
                    const fileName = user.photo.split("/")[user.photo.split("/").length - 1].split(".")[0];
                    cloudinary.v2.uploader.destroy(fileName);
                }
                cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                    user.photo = result.secure_url;
                    }).then( () => {
                        user.save( (err, result) => {
                            if(err) {
                                return res.status(400).json( {message: "Error occur. Please try again"} )
                            }
                            return res.status(200).json( {message: `Info updated!`} );
                        })
                    })
            } else {
                user.save( (err, result) => {
                    if(err) {
                        return res.status(400).json( {message: "Error occur. Please try again"} )
                    }
                    return res.status(200).json( {message: `Info updated!`} );
                })
            }
        } else {
            res.status(400).json( {message: "Password do not match"} );
        }
    })
}

module.exports.postUploadImage = (req, res) => {
    let user = req.userPayload;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
        if(files.photo) {
            cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                user.galleries = [result.secure_url, ...user.galleries];
                req.imageURL = result.secure_url;
            }).then( () => {
                user.save( (err, result) => {
                    if(err) {
                        return res.status(400).json( {message: "Error occur (post upload)"} )
                    }
                    return res.status(200).json( {message: `Image uploaded`, imageURL: req.imageURL} );
                })
            })
        } else {
            return res.status(400).json( {message: "No file choose"} )
        }
    })
}

module.exports.getUploadImages = (req, res) => {
    return res.json( {images: req.userPayload.galleries} );
}

module.exports.putDeleteUploadedImage = async (req, res) => {
    let {img, photoName} = req.body;
    let user = req.userPayload;
    await cloudinary.v2.uploader.destroy(photoName);
    user.galleries = user.galleries.filter( imgURL => imgURL !== img);
    await user.save( (err, result) => {
        if(err) return res.status(400).json( {message: "Error occur (delete uploaded photo)"} );
        return res.status(200).json( {message: "Photo deleted"} );
    });
}

module.exports.followUser = (req, res) => {
    let { followingId } = req.body;
    let followedUser = req.userPayload;
    User.findById(followingId, (err, followingUser) => {
        if(err) return res.status(400).json( {message: "Error occur (follow user)"} );
        // Check followed or not
        let followerIds = [];
        followedUser.followers.map( fl => followerIds.push(String(fl._id)));
        if(followerIds.indexOf(followingId) === -1) {
            followingUser.following.push(followedUser._id);
            followingUser.save();
            followedUser.followers.push(followingId);
            followedUser.save();
            return res.status(200).json( {message: `Following ${followedUser.fullname || followedUser.email}`} );
        } else {
            console.log(followedUser._id, followingUser.following);
            followingUser.following = followingUser.following.filter(fl => fl != String(followedUser._id));
            followingUser.save();
            followedUser.followers = followerIds.filter(fl => fl != String(followingId));
            followedUser.save();
            return res.status(200).json( {message: `UnFollow ${followedUser.fullname || followedUser.email}`} );
        }
    })
}

module.exports.findUser = (req, res) => {
    let { name, uid } = req.query;
    User
    .find({
        _id: { $nin: uid },
        // [type]: new RegExp(name, "i"),
        $or: [
            { "email": new RegExp(name, "i") },
            { "fullname": new RegExp(name, "i") },
        ]
    })
    .select("_id fullname email following followers photo roles")
    .populate("roles", "_id permission")
    .exec( (err, users) => {
        if(err) return res.status(400).json( {message: "error occur - findUser"} );
        return res.status(200).json( users );
    })
}

module.exports.getPrivileges = (req, res) => {
    Privilege.find({}, (err, pris) => {
        return res.status(200).json( pris );
    })
}

module.exports.putChangePrivileges = (req, res) => {
    let { uid, pid } = req.body;
    User.findById(uid, "_id roles", (err, user) => {
        if(err) return res.status(400).json( {message: "User not found"} );
        user.roles = pid;
        user.save( (err, result) => {
            if(err) return res.status(400).json( {message: "Can not modify this user"} );
            return res.status(200).json( {message: `Permission Changed`} );
        });
    })
};

module.exports.requestUpgradeToSpecialAccount = (req, res) => {
    let rq = new RqUpgrade( );
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
        let { email, description, _id } = fields;
        // rq.findOne( {email}, "_id", (err, result) => {
        //     if(result) return res.status.json( {message: "Your email has been registered"})
        // })
        User.findOne({email}, (err, result) => {
            if(err || !result) return res.status(404).json( {message: `Email was not registered.`} );
            rq.email = email;
            rq.description = description;
            rq.owner = _id;
            if(files.photo) {
                cloudinary.v2.uploader.upload(files.photo.path, function(error, result) {
                    rq.photo = result.secure_url;
                }).then( () => {
                    rq.save( (err, result) => {
                        if(err) {
                            return res.status(400).json( {message: "Error occur (request upgrade account)"} )
                        }
                        return res.status(200).json( {message: `Your request was sent`} );
                    });
                })
            } else {
                return res.status(400).json( {message: "No file choose"} )
            }
        })
    })
}


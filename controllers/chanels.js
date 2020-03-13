const formidable = require("formidable");
const cloudinary = require('cloudinary');
const Chanel = require("../models/chanels");
const User = require("../models/users");
const CM = require("../models/chanel-chat");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME2,
    api_key: process.env.API_KEY2,
    api_secret: process.env.API_SECRET2
});

module.exports.getChanels = (req, res) => {
    try {
        Chanel
            .find({})
            .sort({ chanelCreated: -1 })
            .exec((err, chanels) => {
                if (err || !chanels) return res.status(200).json({ message: "error occur (get chanels)" })
                return res.status(200).json(chanels);
            });
    } catch (e) { console.log(e) }

}

module.exports.getChanelsJoined = (req, res) => {
    try {
        let { uid } = req.query;
        User
            .findById(uid)
            .select("_id")
            .populate("chanels.chanelId", "_id chanelName chanelPhoto.photoIcon")
            .exec((err, chanels) => {
                console.log(err, chanels)
                if (err || !chanels) return res.status(400).json({ message: "error occur - get chanel joined" });
                return res.status(200).json(chanels);
            });
    } catch (err) { console.log(err) }
}

module.exports.getSingleChanel = (req, res) => {
    try {
        let { cid } = req.params;
        Chanel
            .findById(cid)
            .populate("chanelMessages.sender", "_id fullname email photo")
            .exec((err, chanel) => {
                console.log(err)
                if (err || !chanel) return res.status(200).json({ message: "error occur (get single chanel)" })
                return res.status(200).json(chanel);
            });
    } catch (e) { console.log(e) }
}

module.exports.getChanelMessage = (req, res) => {
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 5;
    let { cid } = req.params;
    console.log({ limit, skip, cid });
    CM
        .find({ chanelId: cid })
        .populate("sender", "_id fullname email photo")
        .skip(skip)
        .limit(limit)
        .sort({ created: -1 })
        .exec((err, messages) => {
            if (err) {
                console.log(err)
                return res.json({ message: "Limit!" });
            }
            return res.json(messages.reverse());
        });
}

module.exports.postUserJoinChanelServer = async (req, res) => {
    let { uid, cid } = req.body;
    await User
        .findById(uid)
        .select("_id chanels")
        .exec((err, user) => {
            if (err || !user) return res.status(400).json({ message: "error occur - get user to join chanel" });
            user.chanels.push({ chanelId: cid });
            user.save(() => {
                return res.status(200).json({ message: "Done" });
            });
            
        });

}

module.exports.postChanelServerPushMember = async (req, res, next) => {
    let { uid, cid } = req.body;

    await Chanel
        .findById(cid)
        .select("_id members")
        .exec((err, chanel) => {
            if (err || !chanel) return res.status(400).json({ message: "error occur - get user to join chanel" });
            if(chanel.members.indexOf(uid) === -1) {
                chanel.members.push(uid);
                chanel.save( () => next() );
            } else {
                return res.json({ message: "You are already joined this chanel" })
            }
        });

}

module.exports.postCreateChanelServer = (req, res) => {
    try {
        let chanel = new Chanel();
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, function (err, fields, files) {
            console.log(fields)
            let { chanelName, chanelDescription } = fields;
            chanel.chanelName = chanelName;
            chanel.chanelDescription = chanelDescription;
            if (files.photoBackground) {
                cloudinary.v2.uploader.upload(files.photoBackground.path, function (error, result) {
                    if (error) return res.status(400).json({ message: "error occur (photo chanel)" })
                    chanel.chanelPhoto.photoBackground = result.secure_url;
                    chanel.chanelPhoto.photoIcon = result.secure_url;
                }).then(() => {
                    chanel.save((err, result) => {
                        if (err) {
                            return res.status(400).json({ message: "Error occur (create chanel)" })
                        }
                        return res.status(200).json({ message: `Chanel created` });
                    });
                });
            } else {
                return res.status(400).json({ message: "No file choose" })
            }
        })
    } catch (e) { console.log(e) }
}

module.exports.postSaveChanelMessage = (req, res) => {
    try {
        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, function (err, fields, files) {
            let { cid, uid, content } = fields;
            let cm = new CM();
            cm.sender = uid;
            cm.chanelId = cid;
            cm.content = content;

            console.log("***SEND***", { cid, uid, content })
            if (files.photo) {
                cloudinary.v2.uploader.upload(files.photo.path, function (error, result) {
                    if (error) return res.status(400).json({ message: "error occur (photo cm)" })
                    cm.photo = result.secure_url;
                    this.urlContainImage = result.secure_url;
                }).then(() => {
                    cm.save();
                    return res.status(200).json({ urlContainImage: this.urlContainImage });
                });
            } else {
                cm.save();
                return res.json({});
            }

        });
    } catch (e) { console.log(e) }



}


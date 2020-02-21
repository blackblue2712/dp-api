const Notify = require("../models/notify");

module.exports.getNotifications = (req, res) => {
    let { uid } = req.query;
    Notify
    .find( {receiver: uid} )
    // .populate("owner", "_id fullname email photo")
    .sort([["created", -1]])
    .exec( (err, ntfs) => {
        return res.status(200).json(ntfs);
    });
}


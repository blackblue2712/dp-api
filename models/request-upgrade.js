const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const requestUpgradeSchema = new Schema({
    owner: {
        type: ObjectId,
        ref: "users"
    },
    email: String,
    photo: String,
    created: {
        type: Date,
        default: Date.now
    },
    modified: Date,
    status: {
        type: Number,
        default: 0
    },
    statusString: {
        type: String,
        default: "Pending"
    },
    description: String,
    activeCode: {
        type: String
    }
});

const requestUpgrade = mongoose.model("requestUpgrade", requestUpgradeSchema);
module.exports = requestUpgrade;
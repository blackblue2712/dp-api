const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const notifySchema = new Schema({
    owner: {
        type: ObjectId,
        ref: "users"
    },
    name: "",
    receiver: {
        type: ObjectId,
        ref: "users"
    },
    content: String,
    created: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false
    },
    photo: {
        type: String,
    }
})

const notify = mongoose.model("notify", notifySchema);
module.exports = notify;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const chanelChatSchema = new Schema({
    chanelId: {
        type: ObjectId,
        ref: "chanels"
    },
    sender: {
        type: ObjectId,
        ref: "users"
    },
    photo: String,
    content: String,
    created: {
        type: Date,
        default: Date.now
    }
})

const chanelChat = mongoose.model("chanelChat", chanelChatSchema);

module.exports = chanelChat;

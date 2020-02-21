const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const privateChatSchema = new Schema({
    sender: {
        type: ObjectId,
        ref: "users",
        require: true
    },
    receiver: {
        type: ObjectId,
        ref: "users",
        require: true
    },
    content: {
        type: String
    },
    photo: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

const privateChat = mongoose.model("privateChat", privateChatSchema);
module.exports = privateChat;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const announcementSchema = new Schema ({
    title: String,
    body: String,
    tags: [
        {
            type: ObjectId,
            ref: "tags"
        }
    ],
    isImportant: {
        type: Boolean,
        default: false
    },
    owner: {
        type: ObjectId,
        ref: "users"
    },
    status: {
        type: Boolean,
        deafult: true
    },
    views: {
        type: Number,
        default: 0
    },
    anonymousTags: [
        {
            type: String
        }
    ],
    created: {
        type: Date,
        default: Date.now
    }
});

const announcements = mongoose.model("announcements", announcementSchema);
module.exports = announcements;
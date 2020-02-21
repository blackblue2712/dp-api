const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const questionSchema = new Schema ({
    title: String,
    body: String,
    tags: [
        {
            type: ObjectId,
            ref: "tags"
        }
    ],
    anonymousTags: [{
        type: String
    }],
    owner: {
        type: ObjectId,
        ref: "users"
    },
    answers: [
        {
            type: ObjectId,
            ref: "answers"
        }
    ],
    created: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
       default: true
    }
});

const questions = mongoose.model("questions", questionSchema);
module.exports = questions;
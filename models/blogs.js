const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const blogSchema = new Schema({
    title: String,
    body: String,
    tags: [{
        type: ObjectId,
        ref: "tags"
    }],
    anonymousTags: [{
        type: String
    }],
    owner: {
        type: ObjectId,
        ref: "users"
    },
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
    }
});

const blogs = mongoose.model("blogs", blogSchema);
module.exports = blogs;
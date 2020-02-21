const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userGroupsSchema = new Schema ({
    name: String,
    groupACP: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: Date,
    status: {
        type: Boolean,
        default: true
    },
    description: String
});

const userGroups = mongoose.model("userGroups", userGroupsSchema);
module.exports = userGroups;
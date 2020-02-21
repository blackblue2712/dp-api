const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const tagSchema = new Schema ({
    name: String,
    description: String,
    count: {
        type: Number,
        default: 0
    }
});

const tags = mongoose.model("tags", tagSchema);
module.exports = tags;
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const privilegeSchema = new Schema ({
    name: String,
    permission: Number,
    description: String
});

const privileges = mongoose.model("privileges", privilegeSchema);
module.exports = privileges;
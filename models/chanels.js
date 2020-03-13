const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chanelSchema = new Schema({
    chanelName: {
        type: String,
        require: true
    },
    chanelDescription: String,
    chanelPhoto: 
        {
            photoBackground: String,
            photoIcon: String
        }
    ,
    members: [
        {
            type: String,
            ref: "users",
            unique: true
        }
    ],
    chanelCreated: {
        type: Date,
        default: Date.now
    }

});

const chanels = mongoose.model("chanels", chanelSchema);
module.exports = chanels;
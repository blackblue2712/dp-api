const mongoose = require("mongoose");
const crypto = require("crypto");

const Schema = mongoose.Schema;
const ObjectId =  Schema.Types.ObjectId;

const userSchema = new Schema ({
    email: String,
    fullname: String,
    hashed_password: String,
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    modified: Date,
    photo: {
        type: String, 
        default: "https://res.cloudinary.com/dged6fqkf/image/upload/v1581173169/jbwkupd6wxap1udmgfmz.png"
    },
    registerIP: String,
    status: {
        type: Boolean,
        default: true
    },
    resetCode: String,
    bio: String,
    quotes: String,
    isGuildMakeAQuestion: {
        type: Boolean,
        default: false
    },
    roles: {
        type: ObjectId,
        ref: "privileges",
        default: "5d91989c421445308b10631e"
    },
    galleries: [
        {
            type: String
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: "users"
        }
    ],
    followers: [
        {
            type: ObjectId, 
            ref: "users"
        }
    ],
    chanels: [
        {
            chanelId: {
                type: ObjectId,
                ref: "chanels"
            },
            joinTime: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

userSchema.virtual("password") // password is the name of the input pass to server
    .set( function(pw) { // pw is the value of password above
        this._pw = pw;
        this.salt = Math.random().toString(36).slice(-8);
        this.hashed_password = this.encryptPassword(pw);
    })
    .get( function() {
        return this._pw;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function (pw) {
        try {
            return crypto.createHmac("sha256", this.salt)
                .update(pw)
                .digest("hex")
        } catch (err) {
            return "Error hashed password"
        }
    },
    setPassword(plainText) { // pw is the value of password above
        this.salt = Math.random().toString(36).slice(-8);
        this.hashed_password = this.encryptPassword(plainText);
        return plainText;
    }
}

const users = mongoose.model("users", userSchema);
module.exports = users;
const expect = require('chai').expect;
const sinon = require("sinon");
const mongoose = require('mongoose');

const User = require("../models/users");
// const { postSignup } = require("../controllers/auth");
const { getUsers } = require("../controllers/users");

describe("Auth controller - login", () => {
    it("should throw an error with code 500 if accessing the database fails", async (done) => {
        
        mongoose.connect("mongodb://localhost:27017/liars-ask", {useUnifiedTopology: true, useNewUrlParser: true}, () => {
            console.log("Database connecting...");
        });
    })
})
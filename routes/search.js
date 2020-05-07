const express = require("express");
const router = express.Router();
const Ques = require("../models/questions");
const Blogs = require("../models/blogs");
const Acm = require("../models/announcements");
const Tags = require("../models/tags")

router.get("/", async (req, res) => {
    let { category, tags, query, dateFrom, dateTo } = req.query;
    let results = [];
    // console.log({ category, tags, query, dateFrom, dateTo })
    let queryObj = {};

    if(tags) {
        let tagsArr = tags.split("__");
        let tagsIds = await Tags.find({ name: {$in: tagsArr} }, "_id");
        queryObj["tags"] = { $all: tagsIds }
    }

    if(query) {
        queryObj["title"] = new RegExp(query, "gi");
    }

    if(dateFrom) {
        queryObj["created"] = { $gte: dateFrom, $lte: dateTo || new Date() }
    }

    switch(category) {
        case 'announcements':
            results = await Acm.find(queryObj)
            break;
        case 'blogs':
            results = await Blogs.find(queryObj)
            break;
        case 'questions':
            results = await Ques.find(queryObj)
            break;
        default: 
            break;
    }

    res.json(results);
});


module.exports = router;
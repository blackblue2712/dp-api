
const router = require("express").Router();
const {
    searchYoutube
} = require("../controllers/youtube");

router.get("/", searchYoutube);

module.exports = router;
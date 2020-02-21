const router = require("express").Router();

const {
    getTags,
    postAddTag
} = require("../controllers/tags");

const {
    requireSignin
} = require("../controllers/auth");

router.get("/", getTags);
router.post("/add", requireSignin, postAddTag);

module.exports = router;
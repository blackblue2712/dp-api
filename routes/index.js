const router = require("express").Router();

router.get("/", (req, res) => {
    res.send({
        "/": "welcome api",
        "/users": "user api"
    });
});

module.exports = router;

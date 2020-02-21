const router = require("express").Router();
const { getNotifications } = require("../controllers/notify") 
const {
    requireSignin
} = require("../controllers/auth");

router.get("/get-own-notifications", requireSignin, getNotifications);

module.exports = router;
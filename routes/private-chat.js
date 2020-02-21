const router = require("express").Router();
const {
    postSavePrivateMessage,
    getMessageIndividualUser,
    getTotalUnreadMessages,
    readMessage
} = require("../controllers/private-chat");
const  { requireSignin } = require("../controllers/auth");

// router.get("/", priveateChat);
router.get("/messages", requireSignin, getMessageIndividualUser);
router.get("/messages/unread", getTotalUnreadMessages);
router.get("/messages/read", readMessage);
router.post("/new-message", requireSignin, postSavePrivateMessage);

module.exports = router;
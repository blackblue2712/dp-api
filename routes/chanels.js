const router = require("express").Router();

const {
    getChanels,
    getSingleChanel,
    postCreateChanelServer,
    postSaveChanelMessage,
    getChanelMessage,
    getChanelsJoined,
    postUserJoinChanelServer,
    postChanelServerPushMember
} = require("../controllers/chanels");

const  { requireSignin, isAdmin } = require("../controllers/auth");

router.get("/", getChanels);
router.get("/joined", getChanelsJoined);
router.get("/:cid", getSingleChanel);
router.get("/messages/:cid", getChanelMessage);

router.post("/create", requireSignin, isAdmin, postCreateChanelServer);
router.post("/join", requireSignin, postChanelServerPushMember, postUserJoinChanelServer);
router.post("/new-message", requireSignin, postSaveChanelMessage);

module.exports = router;
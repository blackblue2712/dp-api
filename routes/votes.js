
const router = require("express").Router();
const {
    voteUp,
    voteDown,
    requestRelatedAnswerId,
    
} = require("../controllers/votes");

router.post("/answer/voteUp/:ansId", voteUp);
router.post("/answer/voteDown/:ansId", voteDown);

router.param("ansId", requestRelatedAnswerId);

module.exports = router;
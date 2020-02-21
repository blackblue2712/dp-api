const express = require("express");
const router = express.Router();

const {
    getRequestUpgradeToSpecialAccount,
    requestRelatedRequestId,
    postAccecptRequestUpgradeToSpecialAccount,
    postRejectRequestUpgradeToSpecialAccount,
    getVerifyRequestUpgradeToSpecialAccount
} = require("../controllers/request-upgrade");

router.get("/upgrade-account-to-special", getRequestUpgradeToSpecialAccount);
router.post("/upgrade-account-to-special/accept/:rid", postAccecptRequestUpgradeToSpecialAccount);
router.post("/upgrade-account-to-special/reject/:rid", postRejectRequestUpgradeToSpecialAccount);

router.get("/upgrade-account-to-special/verify", getVerifyRequestUpgradeToSpecialAccount);

router.param("rid", requestRelatedRequestId);
module.exports = router;
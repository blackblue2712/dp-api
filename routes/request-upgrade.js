const express = require("express");
const router = express.Router();

const {
	getRequestUpgradeToSpecialAccount,
	requestRelatedRequestId,
	postAccecptRequestUpgradeToSpecialAccount,
	postRejectRequestUpgradeToSpecialAccount,
	getVerifyRequestUpgradeToSpecialAccount
} = require("../controllers/request-upgrade");

const { isAdmin, requireSignin } = require("../controllers/auth")

router.get("/upgrade-account-to-special", requireSignin, isAdmin, getRequestUpgradeToSpecialAccount);
router.post("/upgrade-account-to-special/accept/:rid", requireSignin, isAdmin, postAccecptRequestUpgradeToSpecialAccount);
router.post("/upgrade-account-to-special/reject/:rid", requireSignin, isAdmin, postRejectRequestUpgradeToSpecialAccount);

router.get("/upgrade-account-to-special/verify", requireSignin, isAdmin, getVerifyRequestUpgradeToSpecialAccount);

router.param("rid", requestRelatedRequestId);
module.exports = router;
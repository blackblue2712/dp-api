const express = require("express");
const router = express.Router();

const {
    getUsers,
    requrestRelatedUserId,
    updateStoryUser,
    updateInfoUser,
    getInfoLoggedUser,
    getUploadImages,
    postUploadImage,
    putDeleteUploadedImage,
    getSingleUser, 
    followUser,
    getUsersExceptLoggedOnUser,
    adminGetUsersExceptLoggedOnUser,
    findUser,
    getPrivileges,
    putChangePrivileges,
    requestUpgradeToSpecialAccount

} = require("../controllers/users");

const { requireSignin, isAdmin } = require("../controllers/auth");

router.get("/", getUsers);
router.get("/list/:uid", getUsersExceptLoggedOnUser);
router.get("/admin/list/:uid", adminGetUsersExceptLoggedOnUser);

router.get("/find", findUser);
router.get("/privileges", getPrivileges);
router.put("/privileges", requireSignin, isAdmin, putChangePrivileges);

router.get("/:userId", getSingleUser );

router.get("/profile/:userId", requireSignin, getInfoLoggedUser);
router.put("/story/:userId", updateStoryUser);
router.put("/info/:userId", requireSignin, updateInfoUser);
router.get("/images-gallery/:userId", getUploadImages);
router.post("/images-gallery/new/:userId", requireSignin, postUploadImage);
router.put("/images-gallery/delete/:userId", requireSignin, putDeleteUploadedImage);

router.put("/follow/:userId", followUser);

router.post("/upgrade-account", requireSignin ,requestUpgradeToSpecialAccount)

router.param("userId", requrestRelatedUserId);
module.exports = router;
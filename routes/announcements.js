const router = require("express").Router();
const {
    requireSignin,
    isAdmin,
    isCanWriteAcm
} = require("../controllers/auth");

const {
    requestRelatedAcmId,
    postAnnouncement,
    getAnnouncements,
    getSingleAcm,
    putEditAcm,
    deleteEditAcm,
    getAnnouncementsFromSeperateUser
} = require("../controllers/announcements")

router.get("/", getAnnouncements);
router.post("/new", requireSignin, isCanWriteAcm,postAnnouncement);
router.get("/:acmId", getSingleAcm);
router.put("/edit/:acmId", requireSignin, isCanWriteAcm, putEditAcm);
router.delete("/delete/:acmId", requireSignin, isCanWriteAcm, deleteEditAcm);

router.get("/your-acm/:userId", getAnnouncementsFromSeperateUser);

router.param("acmId", requestRelatedAcmId);


module.exports = router;

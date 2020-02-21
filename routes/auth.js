const router = require("express").Router();
const {
    postSignup,
    postSignin,
    getSignout,
    postPrivileges,
    requireSignin,
    isAdmin,
    yourAreAdmin,
    forgotPassword,
    resetPassword
} = require("../controllers/auth");

const {
    handlePassword,
} = require("../middlewares/userHandleError");

const { check } = require("express-validator");

router.post("/signup", [
        check('email').isEmail().withMessage("Email not vaild"),
        check('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
        check('password').matches(/\d/).withMessage("Password must have at least 1 number")
    ]
, handlePassword, postSignup);

router.post("/signin", postSignin);
router.get("/signout", getSignout);
router.get("/isAdmin", requireSignin, isAdmin, yourAreAdmin);
router.post("/privileges", requireSignin, isAdmin, postPrivileges);
router.get("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
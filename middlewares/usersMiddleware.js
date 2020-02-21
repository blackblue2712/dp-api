const {check} = require("express-validator");

module.exports.validatePassword = (req, res, next) => {
    [
        // check('email').isEmail().withMessage("Email not vaild"),
        check('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
        check('password').matches('\d+').withMessage("Password must have at least 1 number")
    ]
    
    next();
}

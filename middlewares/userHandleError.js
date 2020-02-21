const {validationResult} = require("express-validator");

module.exports.handlePassword = (req, res, next) => {
    const { errors } = validationResult(req);
    if(errors.length > 0) return res.status(400).json( {message: errors[0].msg} );
    next();
}

const Tag = require("../models/tags");
module.exports.postAddTag = (req, res) => {
    let name = req.body.name;

    Tag.findOne( {name}, (err, tag) => {
        if(tag) return res.status(400).json( {message: "This tag was exist"} )
        new Tag(req.body).save( (err, result) => {
            if(err) return res.status(400).json( {message: "Error occur"} );
            return res.status(200).json( {message: 'Done', payload: result} );
        });
    })
    
}

module.exports.getTags = (req, res) => {
    Tag.find({}, (err, tags) => {
        if(err) return res.status(400).json( {message: "Error occur"} );
        return res.status(200).json( {tags} );
    })
}
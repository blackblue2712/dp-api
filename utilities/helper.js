const Tags = require("../models/tags");

module.exports.getTagIds = (tag) => {
    // Promise.all(
    //     tagsnameArray.map( async tag => {
            
    //     })
    // )
    return new Promise( resolve => {
        let tagsNeedToReference = [];
        Tags.findOne( {name: tag}, (err, rs) => {
            if(!rs) {
                let newTag = new Tags({name: tag});
                newTag.save( (err, newTagSaved) => {
                    tagsNeedToReference.push(newTagSaved._id)
                    resolve(newTagSaved);
                });
            } else {
                tagsNeedToReference.push(rs._id)
                resolve(rs)
            }
        })
    })
}

const Answer = require("../models/answers");

module.exports.voteUp = (req, res) => {
    let { userId } = req.body;
    let ans = req.ansInfo;

    let idxId = ans.votes.indexOf(userId);
    let idIndexInVoteDown = ans.votesDown.indexOf(userId);
    console.log(idIndexInVoteDown)
    // Remove uid in vote down before add it to vote up
    if(idIndexInVoteDown !== -1) {
        ans.votesDown.splice(idIndexInVoteDown, 1);
    }

    if(idxId === -1) {
        ans.votes.push(userId);
        ans.save( (err, result) => {
            if(err) return res.status(400).json( {message: "Error occur (vote up)" + err} );
            return res.status(200).json( {message: "Voted", votesLength: ans.votes.length - ans.votesDown.length} );
        });
    } else {
        ans.votes.splice(idxId, 1);
        ans.save( (err, result) => {
            if(err) return res.status(400).json( {message: "Error occur (unvote up)" + err} );
            return res.status(200).json( {message: "Unvoted", votesLength: ans.votes.length - ans.votesDown.length} );
        });
    }
    
}

module.exports.voteDown = (req, res) => {
    let { userId } = req.body;
    let ans = req.ansInfo;
    let idxId = ans.votesDown.indexOf(userId);
    let idIndexInVoteUp = ans.votes.indexOf(userId);

    // Remove uid in vote down before add it to vote down
    if(idIndexInVoteUp !== -1) {
        ans.votes.splice(idIndexInVoteUp, 1);
    }

    if( idxId === -1) {
        ans.votesDown.push(userId);
        ans.save( (err, result) => {
            if(err) return res.status(400).json( {message: "Error occur (vote up)" + err} );
            return res.status(200).json( {message: "Voted", votesLength: ans.votes.length - ans.votesDown.length} );
        });
    } else {
        ans.votesDown.splice(idxId, 1);
        ans.save( (err, result) => {
            if(err) return res.status(400).json( {message: "Error occur (unvote up)" + err} );
            return res.status(200).json( {message: "Unvoted", votesLength: ans.votes.length - ans.votesDown.length} );
        });
    }
}

module.exports.requestRelatedAnswerId = (req, res, next, id) => {
    Answer.findById(id, "votes votesDown", (err, ans) => {
        if(err) return res.status(400).json( {message: "Can't find answer"} );
        req.ansInfo = ans;
        next();
    });
}
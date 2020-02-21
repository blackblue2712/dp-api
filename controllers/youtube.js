const yts = require('yt-search');

module.exports.searchYoutube = (req, res) => {
    let { q } = req.query;
    yts(q, function (err, r) {
        if(!err) {
            const videos = r.videos
            const { url, title, seconds, image, videoId } = videos[0];
            return res.json({ videoId, url, title, seconds, image });
        }
        return res.status(400).json( {message: "Error serach, try again"} );
    });
}




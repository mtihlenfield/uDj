var music = require("../models/music.js");

var queueApi = function(app, queue) {
    
    app.get("/api/queue/", function(req, res, err) {
        console.log("queue request");
        var songs = queue.currentSongs();
        res.send(queue.currentSongs());
    });
    
    app.post("/api/queue/request/:songID", function(req, res, err) {
        var songID = req.params.songID;
        music.getSong(songID, function(err, rows) {
            if (!err && rows.length > 0) {
                 var song = rows[0];
                 queue.request(song["FileLocation"]);
                 res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    });
    
    
    
};

module.exports = queueApi;
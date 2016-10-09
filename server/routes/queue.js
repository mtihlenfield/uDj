var music = require("../models/music.js");

var queueApi = function(app, queue) {
    
    app.get("/api/queue/", function(req, res, err) {
        res.send(queue.currentSongs());
    });
    
    app.post("/api/queue/request/:songID", function(req, res, err) {
        var songID = req.params.songID;
        music.getSong(songID, function(err, rows) {
            if (!err && rows.length > 0) {
                 var song = rows[0];
                 queue.request(song);
                 res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    });
    
    app.post("/api/queue/pause", function(req, res, err){
        queue.pause().then(function(){
           res.sendStatus(200);
        }, function(){
            res.sendStatus(400);
        });
    });
    
    app.post("/api/queue/stop", function(req, res, err){
        queue.pause().then(function(){
            res.sendStatus(200);
        }, function(){
            res.sendStatus(400);
        });
    });
};

module.exports = queueApi;
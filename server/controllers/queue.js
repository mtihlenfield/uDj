var music = require("../models/music.js");

module.exports = function(queue) {

    var getQueue = function(req, res, next) {
        res.send(queue.currentSongs());
    };

    var requestSong = function(req, res, next) {
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
    };

    var pause = function(req, res, next){
        queue.pause().then(function(){
           res.sendStatus(200);
        }, function(){
            res.sendStatus(400);
        });
    };

    var stop = function(req, res, next){
        queue.pause().then(function(){
            res.sendStatus(200);
        }, function(){
            res.sendStatus(400);
        });
    };

    var skip = function(req, res, next) {

    };

    return {
        getQueue: getQueue,
        requestSong: requestSong,
        pause: pause,
        stop: stop,
        skip: skip
    };

};

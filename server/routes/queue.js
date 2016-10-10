var music = require("../models/music.js");

var queueApi = function(app, queue) {

    var queueController = require("../controllers/queue.js")(queue);

    app.get("/api/queue/", queueController.getQueue);

    app.post("/api/queue/request/:songID", queueController.requestSong);

    app.post("/api/queue/pause", queueController.pause);

    app.post("/api/queue/stop", queueController.stop);

    app.post("/api/queue/skip", queueController.skip);
};

module.exports = queueApi;

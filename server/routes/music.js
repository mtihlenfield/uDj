var musicController = require("../controllers/music.js");

var musicApi = function(app) {

  app.post('/api/music/artist', musicController.getArtists);

  app.post('/api/music/artist/:artistID', musicController.getAlbums);

  app.post('/api/music/album/:albumID', musicController.getSongs);

};

module.exports = musicApi;

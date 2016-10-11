var musicController = require("../controllers/music.js");

var musicApi = function(app) {

  app.get('/api/music/artist', musicController.getArtists);

  app.get('/api/music/artist/:artistID', musicController.getAlbums);

  app.get('/api/music/album/:albumID', musicController.getSongs);

};

module.exports = musicApi;

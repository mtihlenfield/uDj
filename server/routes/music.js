var sqlite3 = require('sqlite3').verbose();

var musicApi = function(app) {
  var db = new sqlite3.Database("../db/test.db");
  
  app.post('/api/music/artist', function(req, res, next){
    db.serialize(function(){
      db.all('SELECT * FROM artist', function(err, rows){
        res.send(rows);
      });
    });
  });
  
  app.post('/api/music/artist/:artistID', function(req, res, next){
    db.serialize(function(){
      db.all('select distinct a.AlbumID, a.AlbumName from song as s inner join album as a on s.AlbumID=a.AlbumID where s.ArtistID='+req.params["artistID"], function(err, rows){
        res.send(rows);
      });
    });
  });
  
  app.post('/api/music/album/:albumID', function(req, res, next){
    db.serialize(function(){
      db.all('select distinct s.id, s.Name from song as s inner join album as a on s.AlbumID=a.AlbumID where s.albumID='+req.params["albumID"], function(err, rows){
        res.send(rows);
      });
    });
  });
  
};

module.exports = musicApi;
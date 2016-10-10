var sqlite3 = require('sqlite3').verbose();

module.exports = (function(){
    var db = new sqlite3.Database("../db/test.db");

    var getArtists = function(req, res, next){
        db.serialize(function(){
            db.all('SELECT * FROM artist', function(err, rows){
                res.send(rows);
            });
        });
    };

    var getAlbums = function(req, res, next){
        db.serialize(function(){
          db.all('select distinct a.AlbumID, a.AlbumName from song as s inner join album as a on s.AlbumID=a.AlbumID where s.ArtistID='+req.params.artistID, function(err, rows){
            res.send(rows);
          });
        });
    };

    var getSongs = function(req, res, next){
        db.serialize(function(){
          db.all('select distinct s.id, s.Name from song as s inner join album as a on s.AlbumID=a.AlbumID where s.albumID='+req.params.albumID, function(err, rows){
            res.send(rows);
          });
        });
    };

    return {
        getArtists: getArtists,
        getAlbums: getAlbums,
        getSongs: getSongs
    };
})();

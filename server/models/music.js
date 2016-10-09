var sqlite3 = require('sqlite3').verbose();

module.exports = (function() {
    var db = new sqlite3.Database("../db/test.db");
 
    var getSong = function(id, callback) { //get {id, name. albumID, artistID, location} from songID
        db.serialize(function(){
            db.all('select s.id, s.name, s.filelocation, al.albumname, ar.artistname from song s, album al, artist ar where s.albumid = al.albumid and s.artistid = ar.artistid and s.id = '+ id, callback);
        });
    };
 
    var getArtist = function(artistId, callback){
        db.serialize(function(){
            db.all('select distinct a.AlbumID, a.AlbumName from song as s inner join album as a on s.AlbumID=a.AlbumID where s.ArtistID='+artistId, callback);
        });
    };
 
    
    var getAlbum = function(albumId, callback){
        db.serialize(function(){
            db.all('select distinct s.id, s.Name from song as s inner join album as a on s.AlbumID=a.AlbumID where s.albumID='+ albumId , callback);
        })
    }
    
    return {
      getSong: getSong,
      getArtist: getArtist,
      getAlbum: getAlbum
    };
    
})();

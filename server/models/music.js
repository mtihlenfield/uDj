var sqlite3 = require('sqlite3').verbose();

module.exports = (function() {
    var db = new sqlite3.Database("../db/test.db");
 
    var getSong = function(id, callback) { //get {id, name. albumID, artistID, location} from songID
        db.serialize(function(){
            db.all('SELECT * FROM song WHERE id = '+ id, callback);
        });
    };
 
    //function getArtist(artistID, callback){
    //    db.serialize(function(){
    //        db.all('select distinct a.AlbumID, a.AlbumName from song as s inner join album as a on s.AlbumID=a.AlbumID where s.ArtistID='+artistID, callback);
    //    });
    //};
 
    //function getAlbum(){};
    var getAlbum = function(id, callback){
        db.serialize(function(){
            db.all('select distinct s.id, s.Name from song as s inner join album as a on s.AlbumID=a.AlbumID where s.albumID='+id, callback);
        })
    }
    
    return {
      getSong: getSong  
    };
    
})();

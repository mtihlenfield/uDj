var amqp = require("amqplib");

var Player = {
    
    send: function(payload) {
        return amqp.connect('amqp://localhost')
            .then(function(err, conn) {
                
                if (!err) {
                    return conn.createChannel;
                } else {
                    return Promise.reject(new Error("Failed to connect to queue."));
                }
                
            })
            .then(function(err, channel) {
                var q = "command_queue"
                var msg = JSON.stringify(payload);
                
                if (!err) {
                    channel.assertQueue(q, {durable: false});
                    return channel.sendToQueue(msg, new Buffer(msg));   
                } else {
                    return Promise.reject(new Error("Failed to establish queue channel."));
                }
            });
    },
    
    play: function(uri) {
        
        var payload = {
            "command_type": "request",
            "song": uri
        };
        
        return this.send(payload);
    }, 
    
    stop: function() {
        
        var payload = {
            "command_type": "stop"
        };
        
        return this.send(payload);
    },
    
    pause: function() {
        
        var payload = {
            "command_type": "pause"
        };
        
        return this.send(payload);
    }
    
};

module.exports = (function() {
  
  var queue = [{
      "id": 1, 
      "name": "test-song",
      "album": "test algbum", 
      "artist": "matt I", 
      "location": "music"
  }];
  
  var playNext = function() {
      
  };
  
  var handleMessage = function(msg) {
    console.log(msg);  
  };
  
 function test(callback) {
    amqp.connect('amqp://localhost') 
        .then(function(err, conn) {
            
            if (!err) {
                return conn.createChannel;
            } else {
                return Promise.reject(new Error("Failed to connect to queue."));
            }
            
        })
        .then(function(err, channel) {
            var q = "song_complete_queue";

            if (!err) {
                channel.assertQueue(q, {durable: false});
                channel.consume(q, callback);
            } else {
                //return Promise.reject(new Error("Failed to establish queue channel."));
            }
        }).error(function(){});
  };
  
  var request = function(song) {
      
      if (queue.length == 0) {
          queue.push(song);
          Player.play(song.uri);
      } else {
          queue.push(song);
      }
      
  };
  
  var pause = function() {
      return Player.pause();
  };
  
  var currentSongs = function() {
      console.log("Current songs!");
      return queue;
  };
  
  return {
      request: request, 
      pause: pause, 
      currentSongs: currentSongs
  };
    
})();

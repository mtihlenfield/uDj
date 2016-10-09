var amqp = require("amqplib");

var Player = {
	
	send: function(payload) {
		
		var q = "command_queue";
		var msg = JSON.stringify(payload);
		
		return amqp.connect('amqp://localhost')
			.then(function(conn) {
				return conn.createChannel();
			})
			.then(function(ch) {
				return ch.assertQueue(q).then(function(ok) {
					return ch.sendToQueue(q, new Buffer(msg));
				});
			}).catch(console.error);
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
  	  console.log("Playing from playNext");
	  Player.play(queue[0]);
  };
  
  var handleMessage = function(msg) {
  	console.log("handling message");
	if (queue.length > 0) {
	  queue.pop();
	  playNext();
	} 
  };
  
  (function(callback) {
	var q = "player_queue";
	amqp.connect('amqp://localhost')
	  .then(function(conn) {
		return conn.createChannel();
	  }).then(function(ch) {
		return ch.assertQueue(q).then(function(ok) {
		  return ch.consume(q, callback);
		});
	  }).catch(console.err);
	
  })(handleMessage);
  
  var request = function(song) {
	  
	  if (queue.length == 0) {
		  queue.push(song);
		  console.log("Playing from request");
		  Player.play(song["FileLocation"]);
	  } else {
		  queue.push(song);
	  }
	  
  };
  
  var pause = function() {
	  return Player.pause();
  };
  
  var currentSongs = function() {
	  return queue;
  };
  
  return {
	  request: request, 
	  pause: pause, 
	  currentSongs: currentSongs
  };
	
})();

var amqp = require("amqplib");

var Player = function(host) {

	var send = function(payload) {

		var q = "command_queue";
		var msg = JSON.stringify(payload);

		return amqp.connect(host)
			.then(function(conn) {
				return conn.createChannel();
			})
			.then(function(ch) {
				return ch.assertQueue(q, { "durable": false }).then(function(ok) {
					return ch.sendToQueue(q, new Buffer(msg));
				});
			}).catch(console.error);
	};

	var play = function(uri) {
		console.log("play: ", uri);
		var payload = {
			"command_type": "request",
			"song": uri
		};

		return send(payload);
	};

	var stop = function() {

		var payload = {
			"command_type": "stop"
		};

		return send(payload);
	};

	var pause = function() {

		var payload = {
			"command_type": "pause"
		};

		return send(payload);
	};

	return {
		play: play,
		stop: stop,
		pause: pause
	};

};

module.exports = function(host) {

	var queue = [];
	var player = new Player(host);

	var playNext = function() {
		console.log("Playing from playNext.");
		player.play(queue[0].FileLocation);
	};

	var handleMessage = function(msg) {
		console.log("Handling message: ", msg.content.toString());
		if (queue.length > 1) {
			queue.shift();
			playNext();
		} else if (queue.length == 1){
			queue.shift();
		} else {
			console.warn("Recieved 'song complete' message on empty queue.");
		}
	};

  (function(callback) {
	var q = "song_complete_queue";
	amqp.connect(host)
	  .then(function(conn) {
		return conn.createChannel();
	  })
	  .then(function(ch) {
		return ch.assertQueue(q, {"durable": false})
		.then(function(ok) {
		  return ch.consume(q, callback);
		});
	  }).catch(console.err);

  })(handleMessage);

  var request = function(song) {

	  console.log("Queue: Recived reqeust for: ", song);
	  if (queue.length === 0) {
		  queue.push(song);
		  console.log("Playing from request");
		  player.play(song.FileLocation);
	  } else {
		  queue.push(song);
	  }

  };

  var pause = function() {
	  return player.pause();
  };

  var stop = function() {
	  // important! this does not and should not remove the song from the queue.
	  // A playing song should only be removed from the queue when after the player
	  // sends a completed message
	  return player.stop();
  };

  var currentSongs = function() {
	  return queue;
  };

  return {
	  request: request,
	  pause: pause,
	  currentSongs: currentSongs
  };

};

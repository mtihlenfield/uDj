var amqp = require("amqplib");

var logit = function(message) {
    console.log(message);
}

function run(callback) {
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
                return Promise.reject(new Error("Failed to establish queue channel."));
            }
        });
}

run(logit);
#!/usr/bin/python3

import pika
import json

request = {
    "command_type": "stop"
}

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='player_queue', durable=True)
channel.basic_publish(exchange="", routing_key="player_queue", body=json.dumps(request))
connection.close()

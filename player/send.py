#!/usr/bin/python3
import pika
import json

request = {
    "command_type": "stop"
}

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='command_queue')
channel.basic_publish(exchange="", routing_key="command_queue", body=json.dumps(request))
connection.close()

#!/usr/bin/python3

import pika
import json
import sys

payload = {}

if sys.argv[1] == "request":
    payload["command_type"] = "request"
    payload["song"] = sys.argv[2]
else:
    payload["command_type"] = sys.argv[1]

print("Sending: \n", payload)

connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='command_queue', durable=False)
channel.basic_publish(exchange="", routing_key="command_queue", body=json.dumps(payload))
connection.close()

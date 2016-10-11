#!/usr/bin/python3
import vlc
import pika
# import time
# import threading
import json
import os
import logging
import logging.config


# TODO write unit tests

""" Constants """
MUSIC_FOLDER = os.path.join(os.path.expanduser("~"), "music")
COMMAND_QUEUE = "command_queue"
NOTIFY_QUEUE = "song_complete_queue"
QUEUE_HOST = "localhost"
LOGGING_CONFIG_FILE = "logging-conf.json"


class Player:
    def __init__(self, music_folder, song_complete_callback):
        self.music_folder = music_folder
        self._instance = vlc.Instance()
        self._player = self._instance.media_player_new()
        self._player.stop()  # make sure nothing is playing

        event_manager = self._player.event_manager()
        event_manager.event_attach(vlc.EventType.MediaPlayerEndReached, song_complete_callback)
        event_manager.event_attach(vlc.EventType.MediaPlayerStopped, song_complete_callback)

    def play(self, uri):
        # stop so the callback is fired if there is a song playing already
        if (self.is_playing() or self.is_paused()):
            self.stop()

        local_file = os.path.join(self.music_folder, uri)
        if (os.path.isfile(local_file)):
            media = self._instance.media_new(local_file)
        else:
            media = self._instance.media_new(uri)

        self._player.set_media(media)
        self._player.play()

    def stop(self):
        self._player.stop()

    def pause(self):
        self._player.pause()

    def is_playing(self):
        state = self._player.get_state()
        return (state == vlc.State.Playing)

    def is_paused(self):
        return (self._player.get_state() == vlc.State.Paused)


class QueueListener:

    COMMAND_REQUEST = "request"
    COMMAND_STOP = "stop"
    COMMAND_PAUSE = "pause"

    def __init__(self, song_complete_callback, music_folder, logger=None):
        self._logger = logger

        def callback(event):
            song_complete_callback()

        self._player = Player(music_folder, callback)

    def _log(self, level, msg, *args, **kwargs):
        if self._logger is not None:
            getattr(self._logger, level)(msg)

    def listen(self, ch, method, properties, body):
        content = json.loads(str(body, "utf-8"))
        command_type = content["command_type"]

        if command_type == QueueListener.COMMAND_REQUEST:
            self._log("info", "Playing " + str(content["song"]))
            self._player.play(content["song"])
        elif command_type == QueueListener.COMMAND_PAUSE:
            self._log("info", "Pausing")
            self._player.pause()
        elif command_type == QueueListener.COMMAND_STOP:
            self._log("info", "Stopping")
            self._player.stop()
        else:
            raise Exception("Invalid command")


def main():

    with open(LOGGING_CONFIG_FILE) as logging_config_file:
        logging_json = json.load(logging_config_file)
        logging.config.dictConfig(logging_json)

    logger = logging.getLogger("player")
    logger.info("Starting up...")

    def notify():
        logger.info("Notifying requestor of song completion")
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=QUEUE_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=NOTIFY_QUEUE, durable=False)
        channel.basic_publish(exchange='', routing_key=NOTIFY_QUEUE, body='done')

    listener = QueueListener(notify, MUSIC_FOLDER, logger)

    logger.info("Establishing queue connections...")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=QUEUE_HOST))
    channel = connection.channel()
    channel.queue_declare(queue=COMMAND_QUEUE, durable=False)

    channel.basic_consume(listener.listen, queue=COMMAND_QUEUE, no_ack=True)

    logger.info("Waiting for commands on queue '" + COMMAND_QUEUE + "'...")
    channel.start_consuming()


if __name__ == "__main__":
    main()

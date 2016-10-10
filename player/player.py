#!/usr/bin/python3
import vlc
import pika
import time
import threading
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
    def __init__(self, music_folder):
        self.music_folder = music_folder
        self._instance = vlc.Instance()
        self._player = self._instance.media_player_new()

    def play(self, uri):
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
        return (self._player.get_state() == vlc.State.Playing or
                self._player.get_state() == vlc.State.Opening)

    def is_paused(self):
        return (self._player.get_state() == vlc.Paused)

    def is_running(self):
        return (self._player.get_state() == vlc.State.Playing or
                self._player.get_state() == vlc.State.Opening or
                self._player.get_state() == vlc.State.Paused or
                self._player.get_state() == vlc.State.NothingSpecial)


class QueueListener:

    COMMAND_REQUEST = "request"
    COMMAND_STOP = "stop"
    COMMAND_PAUSE = "pause"

    def __init__(self, song_complete_callback, music_folder, logger=None):
        self.song_complete_callback = song_complete_callback
        self._player = Player(music_folder)
        self._logger = logger
        self._stop_event = threading.Event()

    def _log(self, level, msg, *args, **kwargs):
        if self._logger is not None:
            getattr(self._logger, level)(msg)

    def _play(self, uri):

        if self._player.is_running():
            print("Telling player to stop.")
            self._stop()

        def run():
            current_thread_id = threading.current_thread().ident
            self._log("info", "Thread " + str(current_thread_id) + ": Player thread started.")
            self._player.play(uri)

            while self._player.is_running() and (not self._stop_event.is_set()):
                time.sleep(1)
                continue

            self._stop_event.clear()
            self.song_complete_callback()
            self._log("info", "Player thread " + str(current_thread_id) + " stopped.")

        thread = threading.Thread(target=run)
        thread.start()

    def _pause(self):
        self._player.pause()

    def _stop(self):
        self._player.stop()
        self._stop_event.set()

    def listen(self, ch, method, properties, body):
        content = json.loads(str(body, "utf-8"))
        command_type = content["command_type"]

        if command_type == QueueListener.COMMAND_REQUEST:
            # self._log("info", "Playing: " + str(content["song"]))
            self._play(content["song"])
        elif command_type == QueueListener.COMMAND_PAUSE:
            self._log("info", "Pausing")
            self._pause()
        elif command_type == QueueListener.COMMAND_STOP:
            self._log("info", "Stopping")
            self._stop()
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

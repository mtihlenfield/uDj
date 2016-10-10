#!/usr/bin/python3
import vlc
import pika
import time
import threading
import json
import os


# TODO check if thread is running before starting up a new thread
# TODO setup logging
# TODO write unit tests

""" Constants """
MUSIC_FOLDER = os.path.join(os.path.expanduser("~"), "music")
COMMAND_QUEUE = "command_queue"
NOTIFY_QUEUE = "song_complete_queue"
QUEUE_HOST = "localhost"


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
                self._player.get_state() == vlc.Paused)


class QueueListener:

    COMMAND_REQUEST = "request"
    COMMAND_STOP = "stop"
    COMMAND_PAUSE = "pause"

    def __init__(self, song_complete_callback, music_folder):
        self.song_complete_callback = song_complete_callback
        self._player = Player(music_folder)

    def _play(self, uri):

        if self._player.is_playing or self._player.is_paused():
            self._player.stop()

        def run():
            print("Starting player thread for: ", uri)
            self._player.play(uri)

            while self._player.is_playing or self._player.is_paused():
                time.sleep(1)
                continue

            self.song_complete_callback()
            print("Player thread for ", uri, " stopped.")

        thread = threading.Thread(target=run)
        thread.start()

    def _pause(self):
        self._player.pause()

    def _stop(self):
        self._player.stop()

    def listen(self, ch, method, properties, body):
        content = json.loads(str(body, "utf-8"))
        command_type = content["command_type"]

        if command_type == QueueListener.COMMAND_REQUEST:
            print("playing: ", content)
            self._player.play(content["song"])
        elif command_type == QueueListener.COMMAND_PAUSE:
            print("pausing")
            self._player.pause()
        elif command_type == QueueListener.COMMAND_STOP:
            print("stopping")
            self._player.stop()
        else:
            raise Exception("Invalid command")


def main():
    print("Starting up...")

    def notify():
        print("Player thread ended. Notifying.")
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=QUEUE_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=NOTIFY_QUEUE, durable=False)
        channel.basic_publish(exchange='', routing_key=NOTIFY_QUEUE, body='done')

    listener = QueueListener(notify, MUSIC_FOLDER)

    print("Establishing queue connections...")
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=QUEUE_HOST))
    channel = connection.channel()
    channel.queue_declare(queue=COMMAND_QUEUE, durable=False)

    channel.basic_consume(listener.listen, queue=COMMAND_QUEUE, no_ack=True)

    print("Waiting for commands on queue '" + COMMAND_QUEUE + "'...")
    channel.start_consuming()


if __name__ == "__main__":
    main()

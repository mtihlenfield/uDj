#!/usr/bin/python3
import pygame
import pika

# TODO test get_busy while paused


class Player:

    def __init__(self):
        pygame.mixer.init()
        self.paused = False
        self.playing = False

    def play(self, song_loc):
        print("Playing song")
        pygame.mixer.music.load(song_loc)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            continue
        self.playing = True

    def pause(self):
        self.paused = True
        pygame.mixer.music.pause()

    def unpause(self):
        self.pause = False
        pygame.mixer.music.unpause()

    def stop(self):
        self.pause = False
        self.playing = False
        pygame.mixer.stop()

    def is_playing(self):
        busy = pygame.mixer.music.get_busy()
        print("busy: ", busy)
        return busy


class Slave:

    def __init__(self):
        self.player = Player()
        self.thread = None

    def listen(ch, method, properties, body):
        print(" [x] Received %r" % body)

    def notify():
        pass


def main():
    """ slave = Slave()

    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='commands')
    channel.basic_consume(slave.listen, queue='commands', no_ack=True)
    channel.start_consuming()

    """

    pygame.mixer.init()
    pygame.mixer.music.load("test.mp3")
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        continue


if __name__ == "__main__":
    main()

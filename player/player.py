#!/usr/bin/python3
import pygame
import pika
import time

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

    def listen(self, ch, method, properties, body):
        print(" [x] Received %r" % body)

    def notify(self):
        pass


def main():
    player = Player()
    player.play("test.mp3")
    while player.is_playing:
        time.sleep(1)
        continue


if __name__ == "__main__":
    main()

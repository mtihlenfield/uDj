#!/usr/bin/python3
import pygame
import pika

# TODO test get_busy while paused


class Player:

    def __init__():
        pygame.init()
        pygame.mixer.init()
        self.paused = False
        self.playing = False

    def play(song_loc):
        pygame.mixer.music.load(file)
        pygame.mixer.music.play()
        self.playing = True

    def pause():
        self.paused = True
        pygame.mixer.music.pause()

    def unpause():
        self.pause = False
        pygame.mixer.music.unpause()

    def stop():
        self.pause = False
        self.playing = False
        pygame.mixer.stop()

    def is_playing():
        return pygame.mixer.get_busy()


class Slave:

    def __init__():
        self.player = Player()

    def listen():
        pass

    def notify():
        pass


def main():
    pass

if __name__ == "__main__":
    main()

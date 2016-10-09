#!/usr/bin/python3
import pygame
import time

pygame.mixer.init()
pygame.mixer.music.load("test.mp3")
pygame.mixer.music.play()

while True:
    time.sleep(1)
    continue

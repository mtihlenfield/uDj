#!/usr/bin/python3
import os
import sys
import taglib
import sqlite3

""" Constants """
# mp3, m4a, ogg, and flac are formats that I've tested with taglib
# and that I know will work.
MUSIC_FORMATS = [
    ".mp3",
    ".ogg",
    ".m4a",
    ".flac",
    ".wma"
]
UNKNOWN = "Unknown"
TAG_TITLE = "TITLE"
TAG_ARTIST = "ARTIST"
TAG_ALBUM = "ALBUM"
TAG_GENRE = "GENRE"

""" Technically not constants but close enough """
HOME_DIR = os.path.expanduser("~")
HOME_DIR = os.path.join(HOME_DIR,"Desktop/msqlite")
MUSIC_DIR = os.path.join(HOME_DIR, "music")
DB_LOCATION = os.path.join(HOME_DIR, "test.db")


def create_db(path_to_db):
    """ Creates a music database at the given path """
    connection = sqlite3.connect(path_to_db)
    cursor = connection.cursor()

    # sql = "create table songs ( \
    #          id INTEGER PRIMARY KEY AUTOINCREMENT, \
    #          artist VARCHAR DEFAULT 'Unknown', \
    #          album VARCHAR DEFAULT 'Unknown', \
    #          song_title VARCHAR NOT NULL, \
    #          location VARCHAR NOT NULL \
    #       );"

    cursor.execute(sql)

    connection.commit()
    connection.close()


def find_songs(dir):
    """
    Searches recursively in the directory it is given for song files. Returns
    a generator of paths to the song files.
    """
    for root, directory, filenames in os.walk(dir):
        for file in filenames:
            path = os.path.join(root, file)
            #print("h: "+path[len(dir):])
            name, ext = os.path.splitext(path)
            if ext in MUSIC_FORMATS:
                yield os.path.join(dir.split('/')[-1],path[len(dir)+1:])


def extract_metadata_for_albums(metadata):
    rows = set()
    for song in metadata:
        rows.add(song[3])
    lalbums = []
    i = 0
    for album in rows:
        lalbums += [(i, album)]
        i+=1
    return lalbums

def extract_metadata_for_artists(metadata):
    rows = set()
    for song in metadata:
        rows.add(song[2])
    lartists = []
    i = 0
    for artist in rows:
        lartists += [(i, artist)]
        i+=1
    return lartists

def extract_metadata(song_paths):
    """
    Takes a generator, iterator, or list of paths to music files and returns
    the metadata in a list of tuples. The are structured as follows:
    (artist, album, song_title, location). (Went with list of tuples becuase then
    you can pass it right to an sqlite3 executemany function. Would liked to have
    returned a generator for memory convservation but executemany doesn't take a
    generator)
    """
    rows = []
    i = 0
    for song_path in song_paths:
        full_path = os.path.realpath(song_path)
        # print(full_path)
        song = taglib.File(full_path)
        file_name, ext = name, ext = os.path.splitext(song_path)
        file_name = name.split("/")[-1]

        tags = song.tags
        artist = UNKNOWN if TAG_ARTIST not in tags else tags[TAG_ARTIST][0]
        album = UNKNOWN if TAG_ALBUM not in tags else tags[TAG_ALBUM][0]
        title = file_name if TAG_TITLE not in tags else tags[TAG_TITLE][0]

        rows += [(i, title, artist, album, song_path[len(song_path.split("/")[0])+1:])]
        i += 1
        #print(song_path)
    return rows

def findInTuple(metadata,string):
    for meta in metadata:
        if meta[1] == string:
            return meta[0]
    return -1

def process_metadata(metadata,meta_artist,meta_album):
    new_metadata = []
    for meta in metadata:
        # artistID = findInTuple(meta_artist,meta[2])
        # albumID = findInTuple(meta_album,meta[3])
        albumID = [item[0] for item in meta_album if item[1] == meta[3]][0]#findInTuple(meta_album,meta[2])
        artistID = [item[0] for item in meta_artist if item[1] == meta[2]][0]#findInTuple(meta_artist,meta[3])
        new_metadata += [(meta[0], meta[1], artistID, albumID, meta[4])]
    return new_metadata

def main():
    ##print("Creating the database...")
    ##create_db(DB_LOCATION)

    print("Searching for songs...")
    song_paths = find_songs(MUSIC_DIR)

    num_songs = (1 for song_path in song_paths)
    if num_songs == 0:
        print("No songs found.")
        return

    print("Extracting metadata...")
    metadata = extract_metadata(song_paths)
    # print("-------------------------------------")
    # print(" ")
    # for i in metadata:
    #     print(i)

    ##########################################
    print("Extracting artist metadata")
    artist_metadata = extract_metadata_for_artists(metadata)
    # print("-------------------------------------")
    # print(" ")
    # for i in artist_metadata:
    #     print(i)

    print("Extracting album metadata")
    album_metadata = extract_metadata_for_albums(metadata)
    # print("-------------------------------------")
    # print(" ")
    # for i in album_metadata:
    #     print(i)
    ##########################################

    print("Opening db connection...")
    db_connection = sqlite3.connect(DB_LOCATION)
    db_cursor = db_connection.cursor()

    ##########################################
    print("Inserting album data into db")
    query_album_string = "insert or replace into album values (?, ?)"
    db_cursor.executemany(query_album_string, album_metadata)

    print("Inserting artist data into db")
    query_artist_string = "insert or replace into artist values (?, ?)"
    db_cursor.executemany(query_artist_string, artist_metadata)
    ##########################################

    print("Inserting metadata into db...")
    query_string = "insert or replace into Song values (?, ?, ?, ?, ?)"
    pmetadata = process_metadata(metadata,artist_metadata,album_metadata)
    # print("-------------------------------------")
    # print(" ")
    # for i in pmetadata:
    #     print(i)
    db_cursor.executemany(query_string, pmetadata)

    print("Commiting and closing connection...")
    db_connection.commit()
    db_connection.close()

    print("Done.")

if __name__ == "__main__":
    main()

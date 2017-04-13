'use_strict';

import EleUtil from './ele-util';
import Queue from './queue';

// Class containing functions for song related functionality.
export default class Song {
  static fetchSongs(album) {
    fetch(`/api/music/album/${album.id.split('-')[1]}`)
    .then(res => res.json())
    .then(songs => this.populateSongs(album, songs))
    .catch(err => console.log(err));
  }

  static populateSongs(album, songs) {
    const songList = EleUtil.createEleWithAttrs({ tag: 'ul', classes: ['song-list', 'hide', 'no-display'] });

    for (let i = 0; i < songs.length; i++) {
      const songEle = EleUtil.createEleWithAttrs({
        tag: 'li',
        idName: `song-${songs[i].id}`,
        classes: ['song', 'hover']
      });

      songEle.addEventListener('click', Queue.queueSong);

      const songNameEle = document.createElement('p');
      songNameEle.innerHTML = songs[i].Name;

      songEle.appendChild(songNameEle);
      songList.appendChild(songEle);
    }

    album.appendChild(songList);

    setTimeout(() => {
      EleUtil.addClass(album, 'no-border');
      EleUtil.dropClass(album, 'closed');
      EleUtil.dropClass(songList, 'no-display');

      setTimeout(() => {
        EleUtil.dropClass(songList, 'hide');
      }, 150);

    }, 300);
  }

  static populateCurrentSong({ Name: name, ArtistName: artist, AlbumName: album}) {
    const info = [name, artist, album];
    const currSongEle = EleUtil.getElementByClass('current-song');

    if (!currSongEle.firstElementChild) {
      for (let i = 0; i < 3; i++) {
        const infoEle = document.createElement('h4');
        infoEle.innerHTML = info[i];

        currSongEle.appendChild(infoEle);
      }
    }
  }
}

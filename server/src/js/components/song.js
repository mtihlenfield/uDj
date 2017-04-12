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

      const songNameEle = document.createElement('p');

      songEle.addEventListener('click', Queue.queueSong);

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

  static populateCurrentSong(song) {
    const currSongEle = EleUtil.getElementByClass('current-song');

    if (!currSongEle.children.length) {
      const currSongInfo = [];
      for (let i = 0; i < 3; i++) {
        currSongInfo.push(document.createElement('h4'));
      }

      currSongInfo[0].innerHTML = song.Name;
      currSongInfo[1].innerHTML = song.ArtistName;
      currSongInfo[2].innerHTML = song.AlbumName;

      for (let i = 0; i < currSongInfo.length; i++) {
        currSongEle.appendChild(currSongInfo[i]);
      }
    }
  }
}

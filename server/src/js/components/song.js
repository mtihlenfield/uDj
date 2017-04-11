'use_strict';

import EleUtil from './ele-util';

export default class Song {
  static fetchSongs(album) {
    console.log('fetchSongs()');
    fetch(`/api/music/album/${album.id.split('-')[1]}`)
    .then(res => res.json())
    .then(songs => this.populateSongs(album, songs))
    .catch(err => console.log(err));
  }

  static populateSongs(album, songs) {
    console.log('populateSongs()');
    const songList = EleUtil.createEleWithAttrs({ tag: 'ul', className: 'song-list' });

    for (let i = 0; i < songs.length; i++) {
      const songEle = EleUtil.createEleWithAttrs({ tag: 'li', idName: `song-${songs[i].id}`, classes: ['song', 'hover'] });
      songEle.innerHTML = songs[i].Name;

      songList.appendChild(songEle);
    }

    album.appendChild(songList);

    this.queueSong();
  }

  static queueSong() {
    const songs = document.getElementsByClassName('song');

    for (let i = 0; i < songs.length; i++) {
      songs[i].addEventListener('click', notifyQueue);
    }

    function notifyQueue(e) {
      e.stopPropagation();
      fetch(`/api/queue/request/${this.id.split('-')[1]}`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
    }
  }
}

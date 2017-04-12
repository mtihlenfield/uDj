'use_strict';

import Song from './song';
import EleUtil from './ele-util';


// Class containing functions for queue related functionality.
export default class Queue {
  static queueSong(e) {
    e.stopPropagation();
    fetch(`/api/queue/request/${this.id.split('-')[1]}`, { method: 'POST' })
    .then(() => {
      document.getElementById('add-song-btn').innerHTML = 'Add Song';
      Queue.getQueue();

      const addSongEle = EleUtil.getElementByClass('add-song');
      const artistList = EleUtil.getElementByClass('artist-list');

      EleUtil.slideUp(addSongEle, artistList);
    })
    .catch(err => console.log(err));
  }

  static getQueue() {
    fetch('/api/queue')
    .then(res => res.json())
    .then(this.populateQueue);
  }

  static populateQueue(songs) {
    if (!songs.length) return;

    Song.populateCurrentSong(songs[0]);

    const queueList = EleUtil.getElementByClass('queue-list');

    EleUtil.dropChildren(queueList);

    for (let i = 1; i < songs.length; i++) {
      const songEle = EleUtil.createEleWithAttrs({
        tag: 'li',
        idName: `song-${songs[i].id}`,
        classes: ['song-box', 'border-box', 'center']
      });

      const songInfo = [];
      for (let j = 0; j < 3; j++) {
        songInfo.push(document.createElement('p'));
      }

      songInfo[0].innerHTML = songs[i].Name;
      songInfo[1].innerHTML = songs[i].ArtistName;
      songInfo[2].innerHTML = songs[i].AlbumName;

      for (let j = 0; j < songInfo.length; j++) {
        songEle.appendChild(songInfo[j]);
      }

      queueList.appendChild(songEle);
    }
  }
}

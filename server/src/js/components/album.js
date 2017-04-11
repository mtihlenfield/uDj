'use_strict';

import EleUtil from './ele-util';
import Song from './song';

// Class containing functions for album related functionality.
export default class Album {
  static fetchAlbums(artist) {
    fetch(`/api/music/artist/${artist.id.split('-')[1]}`)
    .then(res => res.json())
    .then(albums => this.populateAlbums(artist, albums))
    .then(this.albumSlide)
    .catch(err => console.log(err));
  }

  static populateAlbums(artist, albums) {
    console.log('populateAlbums()');
    return new Promise(function (resolve, reject) {
      const albumList = EleUtil.createEleWithAttrs({ tag: 'ul', className: 'album-list' });

      for (let i = 0; i < albums.length; i++) {
        const albumEle = EleUtil.createEleWithAttrs({ tag: 'li', idName: `album-${albums[i].AlbumID}`, classes: ['album', 'hover'] });
        albumEle.innerHTML = albums[i].AlbumName;

        albumList.appendChild(albumEle);
      }

      artist.appendChild(albumList);

      resolve();
    });
  }

  static albumSlide() {
    console.log('albumSlide()');
    const albums = document.getElementsByClassName('album');

    for (let i = 0; i < albums.length; i++) {
      albums[i].addEventListener('click', albumToggle);
    }


    function albumToggle(e) {
      console.log('albumToggle()');
      e.stopPropagation();

      EleUtil.dropClass(this, 'hover');

      this.removeEventListener('click', albumToggle);

      for (let i = 0; i < albums.length; i++) {
        if (albums[i] !== this) {
          EleUtil.addClass(albums[i], 'hide');

          setTimeout(() => {
            EleUtil.addClass(albums[i], 'no-display');
          }, 1000);
        }
      }

      setTimeout(() => { Song.fetchSongs(this); }, 1000);
    }
  }
}

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
    return new Promise(function (resolve, reject) {
      const albumList = EleUtil.createEleWithAttrs({ tag: 'ul', classes: ['album-list', 'hide', 'no-display'] });

      for (let i = 0; i < albums.length; i++) {
        const albumEle = EleUtil.createEleWithAttrs({
          tag: 'li',
          idName: `album-${albums[i].AlbumID}`,
          classes: ['album', 'hover']
        });

        const albumNameEle = document.createElement('p');
        albumNameEle.innerHTML = albums[i].AlbumName;

        albumEle.appendChild(albumNameEle);
        albumList.appendChild(albumEle);
      }

      artist.appendChild(albumList);

      setTimeout(() => {
        EleUtil.dropClass(artist, 'closed');
        EleUtil.dropClass(albumList, 'no-display');

        setTimeout(() => {
          EleUtil.dropClass(albumList, 'hide');
        }, 150);

        resolve();
      }, 300);
    });
  }

  static albumSlide() {
    const albums = document.getElementsByClassName('album');

    for (let i = 0; i < albums.length; i++) {
      albums[i].addEventListener('click', albumToggle);
    }

    function albumToggle(e) {
      e.stopPropagation();

      EleUtil.dropClass(this, 'hover');

      this.removeEventListener('click', albumToggle);

      for (let i = 0; i < albums.length; i++) {
        if (albums[i] !== this) {
          setTimeout(() => {
            EleUtil.addClass(albums[i], 'no-display');
          }, 200);
        } else {
          EleUtil.addClass(this, 'closed');

          setTimeout(() => {
            EleUtil.dropClass(this, 'hide');
          }, 150);
        }
      }

      Song.fetchSongs(this);
    }
  }
}

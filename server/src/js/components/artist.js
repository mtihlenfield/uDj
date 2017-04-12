'use_strict';

import Album from './album';
import EleUtil from './ele-util';

// Class containing functions for artist related functionality.
export default class Artist {
  static fetchArtists() {
    return fetch('/api/music/artist')
    .then(res => res.json());
  }

  static populateArtists(artists) {
    return new Promise(function (resolve, reject) {
      const artistList = EleUtil.getElementByClass('artist-list');

      for (let i = 0; i < artists.length; i++) {
        const artistEle = EleUtil.createEleWithAttrs({
          tag: 'li',
          idName: `artist-${artists[i].ArtistID}`,
          classes: ['artist', 'hover']
        });

        const artistNameEle = document.createElement('p');
        artistNameEle.innerHTML = artists[i].ArtistName;

        artistEle.appendChild(artistNameEle);
        artistList.appendChild(artistEle);
      }

      Artist.artistSlide();
      resolve();
    });
  }

  static artistSlide() {
    const artists = document.getElementsByClassName('artist');
    for (let i = 0; i < artists.length; i++) {
      artists[i].addEventListener('click', artistToggle);
    }

    function artistToggle(e) {
      EleUtil.dropClass(this, 'hover');
      this.removeEventListener('click', artistToggle);

      e.stopPropagation();

      for (let i = 0; i < artists.length; i++) {
        EleUtil.addClass(artists[i], 'hide');

        if (artists[i] !== this) {
          setTimeout(() => {
            EleUtil.addClass(artists[i], 'no-display');
          }, 200);
        } else {
          EleUtil.addClass(this, 'closed');

          setTimeout(() => {
            EleUtil.dropClass(this, 'hide');
          }, 150);
        }
      }

      Album.fetchAlbums(this);
    }
  }
}

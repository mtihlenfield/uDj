'use_strict';

import Album from './album';
import EleUtil from './ele-util';

// Class containing functions for artist related functionality.
export default class Artist {
  static fetchArtists() {
    return fetch('/api/music/artist')
    .then(res => res.json())
    .catch(err => console.log(err));
  }

  static populateArtists(artists) {
    console.log('populate artists triggered');
    console.log(this);
    const self = this;

    return new Promise(function (resolve, reject) {
      const artistList = document.getElementsByClassName('artist-list')[0];

      for (let i = 0; i < artists.length; i++) {
        const artistEle = EleUtil.createEleWithAttrs({ tag: 'li', idName: `artist-${artists[i].ArtistID}`, classes: ['artist', 'hover'] });
        artistEle.innerHTML = artists[i].ArtistName;

        artistList.appendChild(artistEle);
      }

      const addSongEle = document.getElementsByClassName('add-song')[0];
      EleUtil.dropClass(addSongEle, 'closed');

      setTimeout(Artist.artistSlide, 1000);
      resolve('artists populated');
    });
  }

  static artistSlide() {
    const artists = document.getElementsByClassName('artist');
    for (let i = 0; i < artists.length; i++) {
      //artists[i].removeEventListener('click', artistTogggle);
      artists[i].addEventListener('click', artistToggle);
    }

    function artistToggle(e) {
      console.log('clicked');

      EleUtil.dropClass(this, 'hover');
      
      //e.stopPropagation();

      //const eles = document.getElementsByClassName('hover');

      /*for (let i = 0; i < eles.length; i++) {
        EleUtil.dropClass(eles[i], 'hover');
      }*/

      for (let i = 0; i < artists.length; i++) {
        if (artists[i] !== this) {
          EleUtil.addClass(artists[i], 'hide');

          setTimeout(() => {
            EleUtil.addClass(artists[i], 'no-display');

          }, 1000);
        }
      }

      for (let i = 0; i < artists.length; i++) {
        artists[i].removeEventListener('click', artistToggle);
      }

      setTimeout(() => { Album.fetchAlbums(this); }, 1000);
    }
  }
}

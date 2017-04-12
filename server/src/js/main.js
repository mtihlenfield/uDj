// Require static assets for webpack
import '../assets/img/favicon-16x16.png';
import '../assets/img/favicon-32x32.png';
import '../assets/img/pause.png';
import '../assets/img/play.png';
import '../assets/img/skip.png';

import '../css/style.scss';

import EleUtil from './components/ele-util';
import Artist from './components/artist';
import Queue from './components/queue';

document.addEventListener('DOMContentLoaded', function () {
  Queue.getQueue();

  addSongSlide();

  setInterval(Queue.getQueue, 5000);

  playPause();

  document.getElementById('skip').addEventListener('click', skip);
});

function addSongSlide() {
  const btn = document.getElementById('add-song-btn');
  btn.addEventListener('click', addSongToggle);

  function addSongToggle(e) {
    e.stopPropagation();

    const addSongEle = EleUtil.getElementByClass('add-song');
    const artistList = EleUtil.getElementByClass('artist-list');

    if (EleUtil.hasClass(addSongEle, 'closed')) {
      btn.innerHTML = 'Cancel';

      Artist.fetchArtists()
      .then(Artist.populateArtists)
      .then(EleUtil.slideDown(addSongEle, artistList))
      .catch(err => console.error(err));
    } else {
      btn.innerHTML = 'Add Song';
      EleUtil.slideUp(addSongEle, artistList);
    }
  }
}

function toggleRecordPause() {
  const style = EleUtil.getElementByClass('ring-container').style;
  if ( document.body.className === 'paused') {
    style.webkitAnimationPlayState = 'running';
    document.body.className = '';
  } else {
    style.webkitAnimationPlayState = 'paused';
    document.body.className = 'paused';
  }
}

function switchPausePlay() {
  const pausePlayEle = EleUtil.getElementByClass('controls').firstElementChild;

  if (pausePlayEle.innerHTML === 'play_arrow') {
    pausePlayEle.innerHTML = 'pause';
  } else {
    pausePlayEle.innerHTML = 'play_arrow';
  }
}

function togglePauseAnim() {
  toggleRecordPause();
  switchPausePlay();
}

function sendPause() {
  return fetch('/api/queue/pause', { method: 'POST' });
}

function playPause() {
  document.getElementById('playPause').addEventListener('click', function () {
    sendPause().then(togglePauseAnim);
  });
}

function skip() {
  return fetch('/api/queue/skip', { method: 'POST' });
}

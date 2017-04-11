// Require static assets for webpack
import '../assets/img/favicon-16x16.png';
import '../assets/img/favicon-32x32.png';
import '../assets/img/pause.png';
import '../assets/img/play.png';
import '../assets/img/skip.png';

import '../css/style.scss';

import EleUtil from './components/ele-util';
import Artist from './components/artist';

document.addEventListener('DOMContentLoaded', function () {
  getQueue();

  addSongSlide();
  setInterval(function(){
    getQueue();
  },115000);
  playPause();

  $("#skip").click(skip);
});

function getQueue() {
  fetch('/api/queue')
  .then(res => res.json())
  .then(songs => {
    if (!songs.length) return;

    populateCurrentSong(songs);

    for (let i = 1; i < songs.length; i++) {
      const songEle = EleUtil.createEleWithAttrs({ tag: 'li', idName: `song-${songs[i].id}`, classes: ['song-box', 'border-box', 'center']});

      const songInfo = [];
      for (let j = 0; j < 3; j++) {
        songInfo.push(document.createElement('span'));
      }

      songInfo[0].innerHTML = songs[i].Name;
      songInfo[1].innerHTML = songs[i].ArtistName;
      songInfo[2].innerHTML = songs[i].AlbumName;

      for (let j = 0; j < songInfo.length; j++) {
        songEle.appendChild(songInfo[j]);
      }

      const queueList = document.getElementsByClassName('queue-list')[0];

      EleUtil.dropChildren(queueList);

      queueList.appendChild(songEle);
    }
  }).catch(err => console.log(err));

  function populateCurrentSong(songs) {
    const currSongEle = document.getElementsByClassName('current-song')[0];
    if (!currSongEle.children.length) {
      const currSongInfo = [];
      for (let i = 0; i < 3; i++) {
        currSongInfo.push(document.createElement('h4'));
      }

      currSongInfo[0].innerHTML = songs[0].Name;
      currSongInfo[1].innerHTML = songs[0].ArtistName;
      currSongInfo[2].innerHTML = songs[0].AlbumName;

      for (let i = 0; i < currSongInfo.length; i++) {
        currSongEle.appendChild(currSongInfo[i]);
      }
    }
  }
}

function addSongSlide() {
  const btn = document.getElementById('add-song-btn');
  btn.removeEventListener('click', addSongToggle);
  btn.addEventListener('click', addSongToggle);

  function addSongToggle(e) {
    e.stopPropagation();
    const addSongEle = document.getElementsByClassName('add-song')[0];

    if (EleUtil.hasClass(addSongEle, 'closed')) {
      btn.innerHTML = 'Cancel';
      Artist.fetchArtists()
      .then(Artist.populateArtists)
      .then(() => {
        const artistList = document.getElementsByClassName('artist-list')[0];
        EleUtil.dropClasses(addSongEle, ['closed', 'no-display']);

        EleUtil.dropClass(artistList, 'hide');
      })
      .catch(err => console.log(err));
    } else {
      btn.innerHTML = 'Add Song';
      const artistList = document.getElementsByClassName('artist-list')[0];
      EleUtil.addClass(artistList, 'hide');

      setTimeout(() => {
        EleUtil.dropChildren(document.getElementsByClassName('artist-list')[0]);

        EleUtil.addClass(addSongEle, 'closed');

        EleUtil.addClass(addSongEle, 'no-display');
      }, 1000);
    }
  }
}

function queueSong () {
  $('.song').click(function (evt) {
    evt.stopPropagation();
    let song = $(this);
    console.log("Click.");
    $.ajax({
      type: "POST",
      url: "./api/queue/request/" + song[0].dataset.id,
      data: {},
      success: function(data) {
        console.log("Request: " + data);
        $('#add-song-btn').text('Add Song');
        getQueue();
        $('.add-song').slideToggle(300, function () {
          $('.artist-list').empty();
        });
      }
    });
  });
}


function populateSongs (album) {
  $('.album').off('click');
  $.ajax({
    type: "GET",
    url:'./api/music/album/' + album[0].dataset.id,
    data: {},
    success: function(data) {
      let ul = $(document.createElement('ul'));
      ul.addClass('song-list');
      for (let i = 0; i < data.length; i++) {
        ul.append('<li class="song hover" data-id="' + data[i].id + '">' + data[i].Name + '</li>');
      }
      $(album[0]).append(ul);
      $(album[0]).children('ul').slideDown(300);

      queueSong();

    }
  });
}



function populateQueue () {
  $.ajax({
    type: "GET",
    url:'./api/music/album/' + album[0].dataset.id,
    data: {},
    success: function(data) {
      let ul = $(document.createElement('ul'));
      ul.addClass('song-list');
      for (let i = 0; i < data.length; i++) {
        ul.append('<li class="song hover" data-id="' + data[i].id + '">' + data[i].Name + '</li>');
      }
      $(album[0]).append(ul);
      $(album[0]).children('ul').slideDown(300);

      queueSong();

    }
  });
}


function toggleRecordPause() {
  let style = document.getElementsByClassName('ring-container')[0].style;
  if ( style.webkitAnimationPlayState === 'running' ) {
    style.webkitAnimationPlayState = 'paused';
    document.body.className = 'paused';
  } else {
    style.webkitAnimationPlayState = 'running';
    document.body.className = '';
  }
}

function switchPausePlay() {
  const pausePlayEle = document.getElementsByClassName('controls')[0].firstElementChild;
  if (pausePlayEle.id === 'play') {
    pausePlayEle.innerHTML = 'pause';
    pausePlayEle.id = 'pause';
  } else {
    pausePlayEle.innerHTML = 'play_arrow';
    pausePlayEle.id = 'play';
  }
}

function togglePauseAnim() {
    toggleRecordPause();
    switchPausePlay();
}

function sendPause() {
    return $.post("./api/queue/pause");
}

function playPause () {
    $('#play').click(function () {
        sendPause().then(togglePauseAnim);
    });
    $('#pause').click(function () {
        sendPause().then(togglePauseAnim);
    });
}

function skip() {
    return $.post("./api/queue/skip");
}

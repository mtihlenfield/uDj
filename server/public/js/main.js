window.onload = function(){
  getQueue();
  addSongSlide();
  /*getQueue().then(function(data) {
    console.log(data);
  });*/
  setInterval(function(){
    getQueue();
  },10000);
  playPause();
}

function pauseAnim () {
  let style = document.getElementsByClassName('ring-container')[0].style;
  if ( style.webkitAnimationPlayState === 'running' ) {
    style.webkitAnimationPlayState = 'paused';
    document.body.className = 'paused';
  } else {
    style.webkitAnimationPlayState = 'running';
    document.body.className = '';
  }
}

function addSongSlide () {
  let btn = $('#add-song-btn');
  btn.off('click');
  btn.click(function (evt) {
    evt.stopPropagation();
    if ($('.add-song').is(':visible')) {
      btn.text('Add Song');
      setTimeout(function() {
        $('.artist-list').empty();
      }, 300);
      $('.add-song').slideToggle(300);
    } else {
      btn.text('Cancel');
      populateArtists();
    }

  });
}

function populateArtists () {
  $.ajax({
    type: "POST",
    url: "./api/music/artist",
    data: {},
    success: function(data){
      for (let i = 0; i < data.length; i++) {
        $(".artist-list").append('<li class="artist hover" data-id="' + data[i].ArtistID + '">' + data[i].ArtistName + '</li>');
      }
      $('.add-song').slideToggle(300);
      artistSlide();
    }
  });
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

function getQueue () {
  $.ajax({
    type: "GET",
    url:'./api/queue',
    data: {},
    success: function(data) {
      console.log(data);
      let ul = $(document.createElement('ul'));
      ul.addClass('queue-list');
      if (data.length <= 0) return;
      document.getElementsByClassName("current-song")[0].getElementsByTagName("h4")[0].innerHTML = data[0].Name+" </br> "+data[0].ArtistName + " </br> " + data[0].AlbumName;
      for (let i = 1; i < data.length; i++) {
        ul.append('<li class="song-box" data-id="' + data[i].id + '">' + data[i].Name + ' </br>' + data[i].ArtistName + '</br>' + data[i].AlbumName + '</li>');
      }
      $('.queue-list').remove();
      $('#queue').append(ul);
    }
  });
}

function populateAlbums (artist) {
  $('.artist').off('click');
  $.ajax({
    type: "POST",
    url:'./api/music/artist/' + artist[0].dataset.id,
    data: {},
    success: function(data) {
      let ul = $(document.createElement('ul'));
      ul.addClass('album-list');
      for (let i = 0; i < data.length; i++) {
        ul.append('<li class="album hover" data-id="' + data[i].AlbumID + '">' + data[i].AlbumName + '</li>');
      }
      $(artist[0]).append(ul);
      $(artist[0]).children('ul').slideDown(300);
      albumSlide();
    }
  });
}

function populateSongs (album) {
  $('.album').off('click');
  $.ajax({
    type: "POST",
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
  })
}

function artistSlide () {
  $('.artist').off('click');
  $('.artist').click(function (evt) {
    evt.stopPropagation();
    $('.hover').removeClass('hover');
    let artist = $(this);
    let ind = artist.index();
    $('.artist:gt(' + ind + ')').fadeOut(200);
    $('.artist:lt(' + ind + ')').fadeOut(200);
    setTimeout(function() {
      populateAlbums(artist);
    }, 200);
  })
}

function albumSlide () {
  $('.album').off('click');
  $('.album').click(function (evt) {
    $('.hover').removeClass('hover');
    evt.stopPropagation();
    let album = $(this);
    let ind = album.index();
    $('.album:gt(' + ind + ')').fadeOut(200);
    $('.album:lt(' + ind + ')').fadeOut(200);
    setTimeout(function() {
      populateSongs(album);
    }, 200);
  })
}

function populateQueue () {
  $.ajax({
    type: "POST",
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
  })
}

function playPause () {
  $('#play').click(function () {
    $(this).attr('id', 'pause');
    $(this).attr('src', 'img/pause.png');
    $(this).attr('alt', 'pause');
  })
  $('#pause').click(function () {
    $(this).attr('id', 'play');
    $(this).attr('src', 'img/play.png');
    $(this).attr('alt', 'play');
  })
  pauseAnim();
}

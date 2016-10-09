window.onload = function(){
  addSongSlide();
  queueSong();
  getQueue().then(function(data) {
    console.log(data);
  });
  
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
  $('#add-song-btn').off('click');
  $('#add-song-btn').click(function () {
    if ($('.add-song').is(':visible')) {
      setTimeout(function() {
        $('.artist-list').empty();
      }, 300);
    } else{
      populateArtists();
    }
    $('.add-song').slideToggle(300);
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
      artistSlide();
    }
  }); 
}

function queueSong () {
  $('.song').click(function () {
    console.log("Click.");
    $.ajax({
      type: "POST",
      url: "./api/queue/request/" + $(this).dataset.id,
      data: {},
      success: function(data) {
        console.log("Request: " + data);
      }
    });
  });
}

function getQueue () {
  return $.get("./api/queue");
}

function populateAlbums (artist) {
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
    }
  })
}

function artistSlide () {
  $('.artist').off('click');
  $('.artist').click(function () {
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
window.onload = function(){
    $('#playButton').click(function(){
        $.ajax({
          type: "POST",
          url: "./api",
          data: {"hello":"Matt"},
          success: function(data){
              alert(data);
          }
        });
    })
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
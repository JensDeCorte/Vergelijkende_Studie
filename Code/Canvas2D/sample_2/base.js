var canvas;
var counter = 0;

window.onload = function () {
  canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  var isStoped = false;

  var loop = function(){
    stats.begin();


      if(stats.getFPS() > 30 || stats.getFPS() < 5 ){
        if(!isStoped){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawRandomRect(ctx);
          counter+=20;
        }
      }
      if(stats.getFPS() < 30 && stats.getFPS() > 10 ){
        isStoped = true;
        stoped();
      }



    stats.end();


    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};

var drawRandomRect = function (ctx) {
  for (var i = 0; i < counter; i++){
    ctx.beginPath();
    ctx.rect(Math.random() * (canvas.width - 50), Math.random() *(canvas.height - 50), 50, 50);
    ctx.fillStyle = "rgba(255, 165, 0, 0.1)";
    ctx.fill();
  }
};

var stoped = function () {
  alert(counter);
};

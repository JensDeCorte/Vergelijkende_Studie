window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.drawImage(document.getElementById('image_test'), 150, 150, 150, 150);
};

var gl,
canvas;
var counter  = 1;

window.onload = function () {
  var stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );


  canvas = document.getElementById("canvas");

  gl = initWebGL(canvas);

  if (gl) {
    gl.clearColor(1, 1, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }


  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderText);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderText);

  var program = createProgram(gl, vertexShader, fragmentShader);

  var triangleVertices = [
    // X, Y    // COLOR: R,G,B
    0.0, 0.0,    0,0,1,
    0.2, 0.0,     0,0,1,
    0.0, 0.2,     0,0,1,
    0.2, 0.0,    0,0,1,
    0.0, 0.2,   0,0,1,
    0.2, 0.2,     0,0,1,
  ];

  var triangleVerticesbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);

  var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttributeLocation, //Attribute location
    2, // Number of elements per Attribute
    gl.FLOAT, // Type of elements
    gl.FALSE, // Normalised or not
    5 * Float32Array.BYTES_PER_ELEMENT,// Size of Attribute
    0// Offest from the beginning of a vertex
  );
  // For Color
  var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');
  gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(colorAttributeLocation);


  //gl.bindTexture(gl.TEXTURE_2D, null);
  //gl.activeTexture(gl.TEXTURE0);

  // Main Render loop
  gl.useProgram(program);

  var lastCalledTime, fps;
  var fpsText = document.getElementById('fps');
  var isStoped = false;


  var loop = function(){
    stats.begin();

        // monitored code goes here
    stats.end();


    if(stats.getFPS() > 30 || stats.getFPS() < 5 ){
      if(!isStoped){
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesbuffer);
        addRectangle(triangleVertices);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertices.length / 5);
      }
    }
    if(stats.getFPS() < 30 && stats.getFPS() > 10 ){
      isStoped = true;
      stoped();
    }



    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

};

function initWebGL(canvas) {
  gl = null;

  // Try to grab the standard context. If it fails, fallback to experimental.
  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }

  return gl;
}

function createShader(gl, type, source) {
  // create and set type of shader
  var shader = gl.createShader(type);

  // set shader source and compile
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // Check if there were compile errors
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  // else delete shader and log error to user;
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function addRectangle(vertices){
  for (var i = 0; i < counter; i++){
    var x = Math.random() * 2 - 1.2;
    var y = Math.random() * 2 - 1.2;
    var yW = y + 0.2;
    var xW = x + 0.2;


    vertices.push.apply(vertices, [
      x, y,    0,0,1,
      xW, y,    0,0,1,
      x, yW,    0,0,1,
      xW, y,    0,0,1,
      x, yW,    0,0,1,
      xW, yW,    0,0,1,
    ]);
  }
  counter += 20;

}

var stoped = function () {
  alert(counter);
};

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();

  // Attach shaders and link them
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Check if there were compile errors
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  // else delete program and log error to user;
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var vertexShaderText = [
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',

  'varying vec3 fragColor;',

  'void main() {',
    'fragColor = vertColor;',
    'gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}'
].join('\n');

var fragmentShaderText = [

  'precision mediump float;',

  'varying vec3 fragColor;',

  'void main() {',

    'gl_FragColor = vec4(fragColor, 0.2);',
  '}'
].join('\n');

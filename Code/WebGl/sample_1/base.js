var gl,
canvas;

window.onload = function () {
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
    // X, Y    // COLOR: U, V
    -0.5, 0.5,    0.0,0.0,
    -0.5, -0.5,   0.0,1.0,
    0.5, 0.5,     1.0,0.0,
    0.5, -0.5,    1.0,1.0,
    -0.5, -0.5,   0.0,1.0,
    0.5, 0.5,     1.0,0.0,
  ];

  var triangleVerticesbuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
  gl.vertexAttribPointer(
    positionAttributeLocation, //Attribute location
    2, // Number of elements per Attribute
    gl.FLOAT, // Type of elements
    gl.FALSE, // Normalised or not
    4 * Float32Array.BYTES_PER_ELEMENT,// Size of Attribute
    0// Offest from the beginning of a vertex
  );
  // For Color
  var texCoordAttributeLocation = gl.getAttribLocation(program, 'vertTexCoord');
  gl.vertexAttribPointer(
    texCoordAttributeLocation,
    2,
    gl.FLOAT,
    gl.FALSE,
    4 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(texCoordAttributeLocation);

  // Create texture
  var boxTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, boxTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    document.getElementById('image_test')
  );


  //gl.bindTexture(gl.TEXTURE_2D, null);
  //gl.activeTexture(gl.TEXTURE0);

  // Main Render loop
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

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
  'attribute vec2 vertTexCoord;',

  'varying vec2 fragTexCoord;',

  'void main() {',
    'fragTexCoord = vertTexCoord;',
    'gl_Position = vec4(vertPosition, 0.0, 1.0);',
  '}'
].join('\n');

var fragmentShaderText = [

  'precision mediump float;',

  'varying vec2 fragTexCoord;',
  'uniform sampler2D sampler;',

  'void main() {',

    'gl_FragColor = texture2D(sampler, fragTexCoord);',
  '}'
].join('\n');

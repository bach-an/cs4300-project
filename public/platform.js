const vertexShaderSource = `
  attribute vec4 a_coords;
  uniform mat4 u_matrix; // transformation matrix
  uniform vec4 u_color;
  varying vec4 v_color;

  // VERTEX SHADER
  void main() {
    // multiply coordinates by a transformation matrix
    gl_Position = u_matrix * a_coords;
    v_color = u_color;
  }
`;


const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_color;
  void main() {
    gl_FragColor = v_color;
  }
`;

// variable declaration for references to WebGL drawing,
let gl              // reference to canva's WebGL context, main API
let attributeCoords // sets 2D location of squares
let uniformColor    // sets the color of the squares
let bufferCoords    // sends geometry to GPU
let uniformMatrix   // transformation matrix

// init function for page load
const init = () => {
  // get a reference to the canvas and WebGL context
  const canvas = document.querySelector("#canvas");
  gl = canvas.getContext("webgl"); // set gl here

  // create and use a GLSL program
  const program = webglUtils.createProgramFromScripts(gl);
  gl.useProgram(program);

  // get reference to GLSL attributes and uniforms
  // set from canvas not the other waty around
  attributeCoords = gl.getAttribLocation(program, "a_coords");
  const uniformResolution = gl.getUniformLocation(program, "u_resolution");
  uniformColor = gl.getUniformLocation(program, "u_color");
  uniformMatrix = gl.getUniformLocation(program, "u_matrix");

  // initialize coordinate attribute to send each vertex to GLSL program
  gl.enableVertexAttribArray(attributeCoords);

  // initialize coordinate buffer to send array of vertices to GPU
  bufferCoords = gl.createBuffer();

  // configure canvas resolution and clear the canvas
  gl.uniform2f(uniformResolution, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

}

const render = () => {
 gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
 gl.vertexAttribPointer(
   attributeCoords, // attribute in GLSL program
   3,               // how many components per iteration (x,y,z)
   gl.FLOAT,        // data type - 32 bit floats
   false,           // normalize = false
   0,               // stride = 0 -- size * sizeof(type) + 0 to get to next position
   0);              // offset = 0 -- start at beginning of the bugger

 gl.enable(gl.CULL_FACE)
 gl.enable(gl.DEPTH_TEST)
 const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
 const zNear = 1;
 const zFar = 2000;

 gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
 shapes.forEach(shape => {
    renderPlatform(shape)
  })
}

let fieldOfViewRadians = m4.degToRad(60)
const computeModelViewMatrix = (canvas, shape, aspect, zNear, zFar) => {
  let M = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar)
  M = m4.translate(M, shape.translation.x, shape.translation.y, shape.translation.z)
  M = m4.xRotate(M, m4.degToRad(shape.rotation.x))
  M = m4.yRotate(M, m4.degToRad(shape.rotation.y))
  M = m4.zRotate(M, m4.degToRad(shape.rotation.z))
  M = m4.scale(M, shape.scale.x, shape.scale.y, shape.scale.z)
  return M
}

const renderPlatform = (platform) => {
  const geometry = [
     0,  0,  0,    0, 30,  0,   30,  0,  0,
     0, 30,  0,   30, 30,  0,   30,  0,  0,
     0,  0, 30,   30,  0, 30,    0, 30, 30,
     0, 30, 30,   30,  0, 30,   30, 30, 30,
     0, 30,  0,    0, 30, 30,   30, 30, 30,
     0, 30,  0,   30, 30, 30,   30, 30,  0,
     0,  0,  0,   30,  0,  0,   30,  0, 30,
     0,  0,  0,   30,  0, 30,    0,  0, 30,
     0,  0,  0,    0,  0, 30,    0, 30, 30,
     0,  0,  0,    0, 30, 30,    0, 30,  0,
    30,  0, 30,   30,  0,  0,   30, 30, 30,
    30, 30, 30,   30,  0,  0,   30, 30,  0
  ]
  const float32Array = new Float32Array(geometry)
  gl.bufferData(gl.ARRAY_BUFFER, float32Array, gl.STATIC_DRAW)
  var primitiveType = gl.TRIANGLES;
  gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);
}

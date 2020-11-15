canvas = document.getElementById('canvas')
const scene = new THREE.Scene();
const spotLight = new THREE.SpotLight(0x1000eb);
const light = new THREE.AmbientLight();
spotLight.position.set(0,2.5,-10);
spotLight.shadow.mapSize.width = 5;
spotLight.shadow.mapSize.height = 5;
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(light);
let cw = canvas.width
let ch = canvas.height
var DONE = false;

// first arg is FOV in degrees
// second arg is aspect ratio
// third and fourth are new and far clipping plane
const camera = new THREE.PerspectiveCamera(90,
  canvas.width / canvas.height, 0.1, 1000);
// render onto the canvas in index
const renderer = new THREE.WebGLRenderer({canvas : canvas});
renderer.setClearColor(0xfffffff, 1);
renderer.setSize(canvas.width, canvas.height);

document.body.appendChild(renderer.domElement);

const group = new THREE.Group(); // add shapes here to render all conveniently
camera.position.z = -2;
camera.position.x = 0;
camera.position.y = 1; // how "tall" player character is

// default position is (0,0,0)
const geometry = new THREE.BoxBufferGeometry(1,1,1);
const material = new THREE.MeshLambertMaterial( { map:cobblestoneTexture} );

let blockTick = 0;
const blockList = [];
let createBlockList = [];

// creating the initial array of objects
for (let i = 0; i < settings.startingBlocks; i++) {
  let newCube = new THREE.Mesh(geometry, material);
  newCube.position.set(0, 0, -i);
  newCube.name = -i;
  group.add(newCube);
  blockList.push(newCube);
}

scene.add(group);

// records the players gamestate
const PlayerObject = {
  camera: camera,
  z_velocity: 0,
  y_velocity: 0,
}

// tracks all pressed buttons
const PressedKeys = {
  'KeyW': false,
  'KeyA': false,
  'KeyS': false,
  'KeyD': false,
  'Space': false,
}

// initializes the event listeners
const init = () => {
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  animate();
}

// activates a down press
function onKeyDown(e) {
  switch(e.code) {
    case 'KeyR':
      location.reload();
      break;
    case 'Space':
      if (onTop()) {
        PlayerObject.y_velocity = physics.jumpVelocity;
      }
    default:
      PressedKeys[e.code] = true;
  }
}

// activates a up press
function onKeyUp(e) {
  PressedKeys[e.code] = false;
}

// generate/update blocks
function generateBlock() {
  if (blockTick % settings.blockGenTickRate == 0) {
    let blockZ = blockList[blockList.length - 1].position.z;
    if (PlayerObject.camera.position.z - blockZ < settings.generateDist) {
      let trueBlock = Math.random() < settings.blockChance;
      createBlockList.push({
        index: blockList.length,
        exists: trueBlock,
        height: 0, // for now
      })
      let newCube = new THREE.Mesh(geometry, material);
      newCube.position.set(0, -10.0, -blockList.length);
      newCube.name = -blockList.length;
      if (trueBlock) {
        group.add(newCube);
      }
      blockList.push(newCube);
    }
  }
  // animate the moving blocks upwards
  createBlockList.forEach(function(block) {
    if (block.exists) {
      cube = blockList[block.index];
      cube.position.y += settings.blockSpeed * (block.height - cube.position.y);
    }
  });
  // removes finished moving blocks
  createBlockList = createBlockList.filter(function(block) {
    if (Math.abs(block.height - blockList[block.index].position.y) < settings.blockMarginError) {
      blockList[block.index].position.y = block.height;
      return false;
    }
    return true;
  });
  blockTick++;
}


// updates the world every tick (60 per second)
function updateGame() {
  if (onTop() && PlayerObject.y_velocity <= 0) {
    PlayerObject.y_velocity = 0;
  } else {
    PlayerObject.y_velocity -= physics.gravity;
  }
  // grounded controls
  if (onTop()) {
    if (PressedKeys['KeyW']) {
      PlayerObject.z_velocity = Math.max(-physics.speedCap,
        PlayerObject.z_velocity - physics.moveAccel)
    }
    else if (PressedKeys['KeyS']) {
      PlayerObject.z_velocity = Math.min(physics.speedCap,
        PlayerObject.z_velocity + physics.moveAccel)
    } else {
      PlayerObject.z_velocity *= 1.0 - physics.friction;
    }
  } else { // aerial controls
    if (PressedKeys['KeyW']) {
      PlayerObject.z_velocity = Math.max(-physics.speedCap,
        PlayerObject.z_velocity - physics.moveAccel * physics.airControl)
    }
    else if (PressedKeys['KeyS']) {
      PlayerObject.z_velocity = Math.min(physics.speedCap,
        PlayerObject.z_velocity + physics.moveAccel * physics.airControl)
    } else {
      PlayerObject.z_velocity *= 1.0 - physics.airRes;
    }
  }
  
  // move the player based on velocity
  PlayerObject.camera.position.z += PlayerObject.z_velocity;
  PlayerObject.camera.position.y += PlayerObject.y_velocity;
  // update the blocks
  generateBlock();

  if (DONE) {
    alert('demo done: you win!');
    location.reload();
  }
  else if (PlayerObject.camera.position.y < -10) {
    location.reload();
  }
}


// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
(function() {
  document.onmousemove = handleMouseMove;
  function handleMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left
    var y = event.clientY - rect.top
    //console.log(x + " " + y);
  } 
})();


// determine if the camera is on top of any of the current objects
// https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-how-to-use-a-raycaster
// used raycasters to figure this out
function onTop() {
  var top = false;
  var raycaster = new THREE.Raycaster();

  camera_copy = {
    z: PlayerObject.camera.position.z,
    x: PlayerObject.camera.position.x,
    y: PlayerObject.camera.position.y,
  }
  raycaster.set(camera_copy, new THREE.Vector3(0, -.5, 0));
  var intersects = raycaster.intersectObjects(group.children);
  if(intersects.length > 0) {
    
    top = true;
  }
  intersects.forEach(element => {
    //console.log(element);
    if(element.object.name == 'cylinder') {
      DONE = true;
    }
  })
  return top;
}


// from three js documntation:
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
renderer.render(scene, PlayerObject.camera);
const animate = function () {
	requestAnimationFrame( animate );
  renderer.render( scene, PlayerObject.camera );
  updateGame();
}

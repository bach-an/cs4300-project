canvas = document.getElementById('canvas')
const scene = new THREE.Scene();
const spotLight = new THREE.SpotLight(0x008000);
const light = new THREE.AmbientLight();
spotLight.position.set(0,2.5,-2.5);
spotLight.shadow.mapSize.width = 2;
spotLight.shadow.mapSize.height = 2;
spotLight.castShadow = true;
scene.add(spotLight);
scene.add(light);
let cw = canvas.width;
let ch = canvas.height;
var DONE = false;
const SHAPES = ['cube', 'cylinder'];
const POWERUPS = [spawnPowerupCube, spawnPowerupSphere];
let near = 0.1;
let far = 1000;

// first arg is FOV in degrees
// second arg is aspect ratio
// third and fourth are new and far clipping plane
const camera = new THREE.PerspectiveCamera(90,
  canvas.width / canvas.height, near, far);
const orthCamera = new THREE.OrthographicCamera(-3, 3,3, -3,  near, far);
orthCamera.position.set(0,5,0);
orthCamera.up.set(0,0,-1);
orthCamera.lookAt(new THREE.Vector3(0,0,0));

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
const cyGeometry = new THREE.CylinderBufferGeometry(0.3,0.3,1,12);
const material1 = new THREE.MeshLambertMaterial( { map:cobblestoneTexture} );
const material2 = new THREE.MeshLambertMaterial({ map: beigeCobblestoneTexture} );

function randomMaterial() {
  textures = [material1, material2];
  return textures[Math.floor(Math.random() * Math.floor(2))];
}

let blockTick = 0;
const blockList = [];
let createBlockList = [];
const powerupList = [];

// creating the initial array of objects
for (let i = 0; i < settings.startingBlocks; i++) {
  let newCube = new THREE.Mesh(geometry, material1);
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
  powerup: false, // whether or not the player has a powerup
  powerUpTime: 0
}

// keep track of some world state
const gameWorld = {
  blockType: 2,
  powerUp: null, // the powerup in the world
  powerUpSpawned: false
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

function setBlock(blockType) {
  gameWorld.blockType = blockType;
}

// generate/update blocks
function generateBlock() {
  if (blockTick % settings.blockGenTickRate == 0) {
    let blockZ = blockList[blockList.length - 1].position.z;

    // if a power up should be generated now...
    if (blockTick % settings.powerupGenTickRate == 0 && !gameWorld.powerUpSpawned) {
      let x = PlayerObject.camera.position.x;
      let y = PlayerObject.camera.position.y;
      let z = blockList[blockList.length - 1].position.z;
      let powerupShapeFun = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
      let powerup = powerupShapeFun(x,y,z);
      gameWorld.powerUp = powerup;
      gameWorld.powerUpSpawned = true;
      group.add(powerup);
    }
    if (PlayerObject.camera.position.z - blockZ < settings.generateDist) {
      let trueBlock = Math.random() < settings.blockChance;
      createBlockList.push({
        index: blockList.length,
        exists: trueBlock,
        height: 0, // for now
      })
      let shapeType = null;
      switch(gameWorld.blockType) {
        case 0:
          shapeType = SHAPES[0];
          break;
        case 1:
          shapeType = SHAPES[1];
          break;
        case 2:
          shapeType = SHAPES[Math.floor(Math.random() * SHAPES.length)];
          break;
      }
      let randomMat = randomMaterial();
      if(shapeType == 'cube') {
        let newCube = new THREE.Mesh(geometry, randomMat);
        newCube.position.set(0, -10.0, -blockList.length);
        newCube.name = -blockList.length;
        if (trueBlock) {
          group.add(newCube);
        }
        blockList.push(newCube);
      }
      else if (shapeType == 'cylinder'){
        let newCy = new THREE.Mesh(cyGeometry, randomMat);
        newCy.position.set(0, -10.0, -blockList.length);
        newCy.name = -blockList.length;
        if (trueBlock) {
          group.add(newCy);
        }
        blockList.push(newCy);
 
      }
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
  if(PlayerObject.powerup) {
    physics.gravity = 0.0009
  }
  else {
    physics.gravity = 0.0012
  }
  // keep track of if a player has a powerup
  if(PlayerObject.powerUpTime == settings.powerUpTime && PlayerObject.powerup) {
    PlayerObject.powerup = false;
    PlayerObject.powerUpTime = 0;
  }
  // if the player is not powered up
  else if(PlayerObject.powerUpTime < settings.powerUpTime && PlayerObject.powerup) {
    PlayerObject.powerUpTime += 1;
  }
  // if player is falling, stop when on top of block
  // or keep y vel same if already 0
  if (onTop() && PlayerObject.y_velocity <= 0) {
    PlayerObject.y_velocity = 0;
  } else { 
    // occurs when jumping/falling
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
    if(Math.abs(PlayerObject.camera.position.z-gameWorld.powerUp.position.z) <= 0.5 && 
       Math.abs(PlayerObject.camera.position.y-gameWorld.powerUp.position.y) <= 0.5 && 
       Math.abs(PlayerObject.camera.position.x-gameWorld.powerUp.position.x) <= 0.5)
    {
      PlayerObject.powerup = true;
      gameWorld.powerUpSpawned = false; 
    } 

  }
  
  // move the player based on velocity
  PlayerObject.camera.position.z += PlayerObject.z_velocity;
  PlayerObject.camera.position.y += PlayerObject.y_velocity;
  // update the blocks
  generateBlock();

  if (PlayerObject.camera.position.y < -10) {

    PlayerObject.camera.position.y = 0
    location.reload();

  }
  rotatePowerup(powerupCube);
  rotatePowerup(powerupSphere);
}

// determine if the camera is on top of any of the current objects
// https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-how-to-use-a-raycaster
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
  return top;
}


// from three js documntation:
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
renderer.render(scene, PlayerObject.camera);
const animate = function () {
 var SCREEN_W, SCREEN_H;
 SCREEN_W = canvas.width;
 SCREEN_H = canvas.height;

 var left,bottom,width,height;

 left = 1; bottom = 1; width = 0.25*SCREEN_W-2; height = SCREEN_H-2;
 renderer.setViewport (left,bottom,width,height);
 renderer.setScissor(left,bottom,width,height);
 renderer.setScissorTest (true);
 orthCamera.aspect = width/height;
 orthCamera.updateProjectionMatrix();
 orthCamera.position.z = PlayerObject.camera.position.z
 renderer.render( scene, orthCamera);
 left = 0.25*SCREEN_W+1; bottom = 1; width = 0.75*SCREEN_W-2; height = SCREEN_H-2;
 renderer.setViewport (left,bottom,width,height);
 renderer.setScissor(left,bottom,width,height);
 renderer.setScissorTest (true);  // clip out "viewport"
 camera.aspect = width/height;
 camera.updateProjectionMatrix();
 requestAnimationFrame( animate );
 renderer.render( scene, PlayerObject.camera );
 updateGame();
}


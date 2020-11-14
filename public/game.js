canvas = document.getElementById('canvas')
//const scene = new THREE.Scene();

Physijs.scripts.worker = 'utils/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';
const scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3(0, -10, 0));
let cw = canvas.width
let ch = canvas.height


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
camera.position.z = 2;
camera.position.x = 0;
camera.position.y = 1; // how "tall" player character is


/*
const floorGeometry = new THREE.BoxBufferGeometry(100, 0.5, 100);
const floorMaterial = new THREE.MeshBasicMaterial( { map:floorTexture } );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.position.set(0, -1, 0);
group.add(floor);

floor.name = 'f1'
*/
// default position is (0,0,0)
const geometry = new THREE.BoxBufferGeometry(1,1,10);
const material = new THREE.MeshBasicMaterial( { map:cobblestoneTexture} );
const cube = new THREE.Mesh( geometry, material );
const cube2 = new THREE.Mesh( geometry, material );
cube2.position.set(0,0,-11);
cube.name = 'c1';
cube.name = 'c2';


group.add(cube);
group.add(cube2);
scene.add(group);


document.addEventListener('keypress', onKeyPress);
var pause = false
// param to determine how fast the camera is moving in the z dir
const speed = 0.02
function onKeyPress(e) {
  switch(e.code) {
    case 'KeyW':
      camera.position.z -= speed;
      break;
    case 'KeyS':
      camera.position.z += speed;
      break;
    case 'Space':

      camera.position.z -= 0.75
      camera.position.y += 20 * -gravity;

      break;
    case 'KeyP':
      pause = !pause;
      break;
    default:
      console.log(e.code);
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
//https://steemit.com/utopian-io/@clayjohn/learning-3d-graphics-with-three-js-or-how-to-use-a-raycaster
// used raycasters to figure this out
function onTop() {
  var top = false;
  var raycaster = new THREE.Raycaster();
  raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
  var intersects = raycaster.intersectObjects(group.children);
  if(intersects.length > 0) {
    top = true;
  }
  return top;
}


// from three js documntation:
// https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
renderer.render(scene, camera);
let i = 0;
const animate = function () {
  if(camera.position.z >= 2) {
    camera.position.z = 2;
  }
  if(pause) {
    camera.position.z -= speed;
  }
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  if(!onTop() || camera.position.y > 1) {
    camera.position.y += gravity;
  }
  /* UNCOMMENT TO SET FAIL STATE
  if (camera.position.y <-3) {
    alert('you lose')
    location.reload();
  }*/
  
}
animate();

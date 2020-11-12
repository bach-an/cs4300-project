canvas = document.getElementById('canvas')
const scene = new THREE.Scene();
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

const geometry2 = new THREE.BoxBufferGeometry(1,1,10);
const material2 = new THREE.MeshBasicMaterial( { map:cobblestoneTexture } );
const cube2 = new THREE.Mesh( geometry2, material2 );
cube2.position.set(0,0,-11);
cube.name = 'c1'
cube2.name = 'c2'


group.add(cube);
group.add(cube2);

scene.add(group);


document.addEventListener('keypress', onKeyPress);

// param to determine how fast the camera is moving in the z dir
const speed = 0.75
function onKeyPress(e) {
  switch(e.code) {
    case 'KeyW':
      console.log(camera.position)
      camera.position.z -= speed;
      break;
    case 'KeyS':
      camera.position.z += speed;
      break;
    case 'Space':
      camera.position.y += 0.1;
      break;
    default:
      console.log(e.code)
    }
}
group.children.forEach(function (shape) {
  console.log(shape)
  var target = new THREE.Vector3();
  console.log(shape.getWorldPosition(target))
})

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
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  if(!onTop()) {
    console.log('gravity')
    camera.position.y += gravity
  }
}
animate();

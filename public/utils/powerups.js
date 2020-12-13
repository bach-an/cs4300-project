// Powerups will change the way gravity works for the game
// only 1 powerup will exist at a time
// once a player gets a power up, it will go away after 5 seconds

let powerupSize = 0.25;
//https://stackoverflow.com/questions/14924187/change-the-colors-of-a-cubes-faces
let powerupCubeGeo = new THREE.BoxGeometry(powerupSize,powerupSize,powerupSize);
let powerupSphereGeo = new THREE.SphereGeometry(powerupSize - 0.05, 8, 8);
for ( var i = 0; i < powerupCubeGeo.faces.length; i ++ ) {
    powerupCubeGeo.faces[ i ].color.setHex( Math.random() * 0xffffff );
}
for ( var i = 0; i < powerupSphereGeo.faces.length; i ++ ) {
    powerupSphereGeo.faces[ i ].color.setHex( Math.random() * 0xffffff );
}

let powerupMaterial = new THREE.MeshBasicMaterial({color : 0xffffff, vertexColors : true});
let powerupCube = new THREE.Mesh(powerupCubeGeo, powerupMaterial);
let powerupSphere = new THREE.Mesh(powerupSphereGeo, powerupMaterial);

// spawns a powerup cube at the location
function spawnPowerupCube(x,y,z) {
  powerupCube.position.set(x,y,z);
  return powerupCube;
}

function spawnPowerupSphere(x,y,z) {
  powerupSphere.position.set(x,y,z);
  return powerupSphere;
}

// https://www.jonathan-petitcolas.com/2013/04/02/create-rotating-cube-in-webgl-with-threejs.html
let speed = 0.015;
function rotatePowerup(powerup) {
  powerup.rotation.x -= speed;
  powerup.rotation.y -= speed;
  powerup.rotation.z -= speed;

}


const loader = new THREE.TextureLoader();
let cobblestone = 'textures/cobblestone.jpeg';
let cobblestoneTexture = loader.load(cobblestone)
cobblestoneTexture.wrapS = THREE.RepeatWrapping;
cobblestoneTexture.wrapT = THREE.RepeatWrapping;
cobblestoneTexture.repeat.x = 1;
cobblestoneTexture.repeat.y = 20;

let tile = 'textures/floor-tile.jpeg';
let floorTexture = loader.load(tile)
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;

floorTexture.repeat.x = 30;
floorTexture.repeat.y = 30;

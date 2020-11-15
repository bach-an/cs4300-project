const loader = new THREE.TextureLoader();
let cobblestone = 'textures/cobblestone.jpeg';
let cobblestoneTexture = loader.load(cobblestone);
cobblestoneTexture.wrapS = THREE.RepeatWrapping;
cobblestoneTexture.wrapT = THREE.RepeatWrapping;
cobblestoneTexture.repeat.x = 1;
cobblestoneTexture.repeat.y = 1;

let cylinderTexture = loader.load(cobblestone);
cylinderTexture.repeat.x = 1;
cylinderTexture.repeat.y = 1;

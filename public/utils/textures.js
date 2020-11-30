const loader = new THREE.TextureLoader();

let cobblestone = 'textures/cobblestone.jpeg';
let cobblestoneTexture = loader.load(cobblestone);
let beigeCobblestone = 'textures/beige_cobblestone.jpeg';
let beigeCobblestoneTexture = loader.load(beigeCobblestone);

cobblestoneTexture.wrapS = THREE.RepeatWrapping;
cobblestoneTexture.wrapT = THREE.RepeatWrapping;

beigeCobblestone.wrapS = THREE.RepeatWrapping;
beigeCobblestone.wrapT = THREE.RepeatWrapping;

cobblestoneTexture.repeat.x = 1;
cobblestoneTexture.repeat.y = 1;
beigeCobblestoneTexture.repeat.x = 1;
beigeCobblestoneTexture.repeat.y = 1;

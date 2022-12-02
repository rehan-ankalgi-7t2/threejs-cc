import * as THREE from 'three';
import { AmbientLight } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import sky from '../images/sky.jpg';
import cactus from '../images/cactus.webp';

const blockyURL = new URL('../assets/blocky.gltf', import.meta.url);


// initiating a renderer
const renderer = new THREE.WebGL1Renderer();
// set size for the renderer on the screen
renderer.setSize(window.innerWidth, window.innerHeight);
// adding renderer to the body as the dom element
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
// renderer.setClearColor(0x87CEEB);

// creting new scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(sky);

const assetLoader = new GLTFLoader();

// create new perspective camera with parameters (FOV, Aspect ratio, near and far)
const camera = new THREE.PerspectiveCamera(
    45, // FOV
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // near
    1000 // far
);

// orbit controls to control the camera using mouse
// hold left key & movements -> rotation
// hold right key & movements -> move camera up and dowm
// scroll -> zoom in and out
const orbit = new OrbitControls(camera, renderer.domElement);

// displays axes for help
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// set camera position
camera.position.set(-10, 30, 30);
orbit.update(); // orbit is updated whenever the camera moves !important

// lighting constants
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
const directionalLight = new THREE.DirectionalLight( 0xFFFFFF , 0.8); // soft white light
scene.add( ambientLight );
scene.add( directionalLight );
directionalLight.position.set(-15, 15, 0);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -24;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(directionalLightHelper);

// define geometry of the cube
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color: 0xFFA500});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xFF0000,
    wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 0, 0);
sphere.castShadow = true;

let step = 0;
let speed = 0.04;

const cactusGeometry = new THREE.BoxGeometry( 6, 6, 6 );
const cactusMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load(cactus)
});
const Cactus = new THREE.Mesh(cactusGeometry, cactusMaterial);
scene.add(Cactus);
Cactus.position.set(10, 4, 0);
Cactus.castShadow = true;

assetLoader.load(blockyURL.href, function(gltf){
    const model = gltf.scene;
    scene.add(model);
    gltf.scene.scale.set(0.01, 0.01, 0.01);
    model.position.set(-12, 4, 10);
}, undefined, function(err){
    console.error(err);
});

// animate the rotation of the cube
function animate(){
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;

    step += speed;
    sphere.position.y = 10 * Math.sin(step);

    Cactus.rotation.y += 0.08;

    renderer.render(scene, camera);
}

// animation loop for the cube rotation
renderer.setAnimationLoop(animate);

// render methods renders thr scene in the browser
renderer.render(scene, camera);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
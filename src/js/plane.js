import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, window.innerWidth / window.innerHeight, 1, 10000
);

const orbit = new OrbitControls(camera, renderer.domElement);

// displays axes for help
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper();
scene.add(gridHelper);

// set camera position
camera.position.set(0, 20, 100);
orbit.update(); // orbit is updated whenever the camera moves !important

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI;

function animate(){
    orbit.update();
    renderer.render(scene, camera);
}

requestAnimationFrame(animate);
// render methods renders thr scene in the browser
renderer.render(scene, camera);


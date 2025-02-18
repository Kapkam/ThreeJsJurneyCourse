/**
 * In this leasson we will learn to use materials in Three.js
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import  {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * GUI
 */

const gui = new GUI();


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./textures/matcaps/3.png')
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')

// Encode the texture to sRGB
doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Geometries
 */

// Material for the 3 geometries

// Mesh Basic Material
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color('red');
// material.wireframe = true;
// material.transparent = true;
// material.opacity = .2;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide; // FontSide or BackSide

// Mesh Normal Material ( for lihting )
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

// Mesh Matcap Material (no lighting is ilusioned)
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// Mesh Depth Material (is for render the depth of the object to create shadows depending on the distance from camera)
// const material = new THREE.MeshDepthMaterial();

// Mesh Lambert Material (REQUIERES LIGHT) BEST PERFORMANCE
// const material = new THREE.MeshLambertMaterial();


// Mesh Phong Material (REQUIERES LIGHT) (has less performance than Lambert)
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// Mesh Toon Material (REQUIERES LIGHT)
// const material = new THREE.MeshToonMaterial();
// gradientTexture.magFilter = THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;
// material.gradientMap = gradientTexture;

// Mesh Standard Material (REQUIERES LIGHT)
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 1;
// material.roughness = 1;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05; // how much the displacement map will affect the geometry
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture; // create the illusion of depth
// material.normalScale.set(0.5, 0.5); // how much the normal map will affect the geometry
// material.transparent = true;
// material.alphaMap = doorAlphaTexture; // It say where the texture will be transparent or not

//Tweaks
// gui.add(material, 'metalness').min(0).max(1).step(0.01);
// gui.add(material, 'roughness').min(0).max(1).step(0.01);
// gui.add(material, 'displacementScale').min(0).max(1).step(0.01);
// gui.add(material.normalScale, 'x').min(0).max(1).step(0.01);
// gui.add(material, 'transparent');

// Mesh Physical Material (REQUIERES LIGHT)
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 0;
material.roughness = 0;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05; // how much the displacement map will affect the geometry
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture; // create the illusion of depth
// material.normalScale.set(0.5, 0.5); // how much the normal map will affect the geometry
// material.transparent = true;
// material.alphaMap = doorAlphaTexture; // It say where the texture will be transparent or not

// Clearcoat
// material.clearcoat = 1;
// material.clearcoatRoughness = 0;

// Sheen (highlight the material when seen from narrow angle)
// Usally used on fluffy materials
// material.sheen = 1;
// material.sheenRoughness = 0.25;
// material.sheenColor.set(1, 1, 1)

// Iridescence (color changes depending on the angle) efecto gasolina
// material.iridescence = 1;
// material.iridescenceIOR = 1;
// material.iridescenceThicknessRange = [ 100, 800];

// Transmission (for glass)
material.transmission = 1;
material.ior = 1.5; // For Water: 1.333, Glass: 1.5, Diamond: 2.417, Air: 1.000293
// https://en.wikipedia.org/wiki/List_of_refractive_indices
material.thickness = 0.5;

//Tweaks
gui.add(material, 'metalness').min(0).max(1).step(0.01);
gui.add(material, 'roughness').min(0).max(1).step(0.01);
gui.add(material, 'displacementScale').min(0).max(1).step(0.01);
gui.add(material.normalScale, 'x').min(0).max(1).step(0.01);
gui.add(material, 'transparent');
gui.add(material, 'clearcoat').min(0).max(1).step(0.01);
gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.01);
gui.add(material, 'sheen').min(0).max(1).step(0.01);
gui.add(material, 'sheenRoughness').min(0).max(1).step(0.01);
gui.addColor(material, 'sheenColor');
gui.add(material, 'iridescence').min(0).max(1).step(0.001);
gui.add(material, 'iridescenceIOR').min(0).max(2.333).step(0.001);
gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1);
gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1);
gui.add(material, 'transmission').min(0).max(1).step(0.01);
gui.add(material, 'ior').min(1).max(10).step(0.00001);
gui.add(material, 'thickness').min(0).max(1).step(0.01);



// Light
// // add light to the scene
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);
// // add point light
// const pointLight = new THREE.PointLight(0xffffff, 30);
// scene.add(pointLight);
// pointLight.position.set(2, 3, 4);

/**
 * Enviroment Map
 * For some enviroment maps as it contributes to the ligthing
 * it will be not necessary to add extra lights to the scene, as in this case
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./textures/environmentMap/2k.hdr', (enviromentMap) => {
    // apply the enviroment map to the scene
    enviromentMap.mapping = THREE.EquirectangularReflectionMapping;
    // adding to the scene as background
    scene.background = enviromentMap;
    // adding to the scene as enviroment so the objects can reflect the enviroment
    scene.environment = enviromentMap;
});

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(.5, 64, 64),
    material
);
sphere.position.x = -1.5;

// Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1, 100, 100),
    material
);
plane.position.x = 0;

// Torus
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.3, .2, 64, 128),
    material
);
torus.position.x = 1.5;

// Add to scene
scene.add(sphere, plane, torus);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .1 * elapsedTime
    plane.rotation.y = .1 * elapsedTime
    torus.rotation.y = .1 * elapsedTime

    sphere.rotation.x = -.15 * elapsedTime
    plane.rotation.x = -.15 * elapsedTime
    torus.rotation.x = -.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
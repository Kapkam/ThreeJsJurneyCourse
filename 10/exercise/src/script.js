
/**
 * In this lesson we are going to learn how to load textures in three.js
 * We are going to use the TextureLoader class to load textures in three.js
 * We will see how to use textures.
 * We will see the minification and magnification filter.
 * IMPORTANT: For better performance is recomended to use JPG textures and smaller textures.
 * NOTE: for "nomal" is better to use PNG textures because they have less lost of data.
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Textures
 */
// const image = new Image();
// const texture = new THREE.Texture(image);
// // We need to encode in sRGB the texture (this is from latest versions of three.js)
// texture.colorSpace = THREE.SRGBColorSpace;

// image.onload = () => {
//     texture.needsUpdate = true;
// }
// image.src = '/textures/door/color.jpg';

// Better way
const loadingManager =  new THREE.LoadingManager();
// loadingManager.onStart = () => {
//     console.log('onStart');
// }
// loadingManager.onLoad = () => {
//     console.log('onLoad');
// }
// loadingManager.onProgress = () => {
//     console.log('onProgress');
// }
// loadingManager.onError = () => {
//     console.log('onError');
// }
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load(
    '/textures/door/color.jpg',
    () => {
        console.log('load');
    },
    () => {
        console.log('progress');
    },
    () => {
        console.log('error');
    },
);
// // We need to encode in sRGB the texture (this is from latest versions of three.js)
colorTexture.colorSpace = THREE.SRGBColorSpace;
const checkerboardTexture = textureLoader.load('/textures/minecraft.png');
checkerboardTexture.colorSpace = THREE.SRGBColorSpace;
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const heightTexture = textureLoader.load('/textures/door/height.jpg');
const normalTexture = textureLoader.load('/textures/door/normal.jpg');
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping; // reapet on X axis
// colorTexture.wrapT = THREE.RepeatWrapping; // repeat on Y axis

// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;

// colorTexture.rotation = Math.PI * 0.25;

// Move the pivot point to the center of the texture
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// Three.js let you change the minification and magnification filter to obtain
// a better quality of the texture

// Deactivate the mipmap
// colorTexture.generateMipmaps = false;
// checkerboardTexture.minFilter = THREE.NearestFilter;
checkerboardTexture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: checkerboardTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
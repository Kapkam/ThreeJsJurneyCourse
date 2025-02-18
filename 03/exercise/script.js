/**
 * * Three main concepts in Three.js
 * Here we will see the three main concepts in Three.js
 * We will learn how to create a scene, a camera, a mesh, and a renderer.
 */

import * as THREE from 'three';

// Canvas
// Initialize the canvas!
const canvas = document.querySelector('canvas.webgl');

console.log("Hola! Soy el primer script2");
console.log(THREE);

/**
 *  * Three main concepts in Three.js
 * Scene: A scene is where you put objects, lights, and cameras. It's like a stage in a theater.
 * Camera: A camera is what looks at the scene. It's like a camera in real life.
 * Mesh: A mesh is a combination of a geometry (the shape) and a material (how it looks)
 * Renderer: A renderer is what takes the scene and the camera and makes an image, and then provided to the webpage.
 */

// Scene
// Initialize the scene!
const scene = new THREE.Scene();

// Geometry (Object)
// Initialize the geometry!
// THREE.BosGeometry(width, height, depth)
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material
// Initialize the material!
// THREE.MeshBasicMaterial({ object }) -> A material for drawing geometries in a simple shaded (flat or wireframe) way.
// https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Mesh
// Initialize the mesh!
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);


// Sizes
// Define the size of the canvas!
const sizes = {
    width: 800,
    height: 600
}

// Camera
// Initialize the camera!
// PerspectiveCamera: A camera with perspective projection, if the object is far away it will look smaller and if it is close it will look bigger.
// THREE.PerspectiveCamera(fov [field of view], aspect [aspect ratio], near, far)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// In z axis positive values are backward and negative values are forward.
camera.position.z = 3;

// Add camera to scene
scene.add(camera);

// Renderer
// Initialize the renderer!
// THREE.WebGLRenderer({ canvas }) -> A renderer that uses WebGL to render the scene.
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

// Set the size of the renderer
renderer.setSize(sizes.width, sizes.height);

// Here the canvas is ready to render the scene, Almost Finished!

// Render
// Use the renderer to render the scene with the camera!
// The render method will render the scene with the camera that we have set up.
renderer.render(scene, camera);

// At this point You will see a black screen, this is because the camera is inside the cube, and the cube is blocking the camera's view.
// To fix this we need to move the camera back a little bit or moove the mesh foward. In this case we will move the camera back.
// So to move the camera back we need to set the position of the camera, for that we have 3 properties: x, y, z.
// So to move backward the camera we need to set the z property of the camera to a positive value.
// Go Up and set the z property of the camera to 3.

// Now you will see a red cube in the center of the screen.
// Done! You have created a scene, a camera, a mesh, and a renderer in Three.js.
// Congratulations! 🎉
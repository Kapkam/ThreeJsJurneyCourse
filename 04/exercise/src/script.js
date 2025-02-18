/**
 * * Move objects in Three.js
 * We will learn how to move objects in Three.js.
 */

/**
 * The first property that lets you moves objects is the position property.
 * The position property is a vector that represents the position of the object in 3D space.
 * Ih has the following properties:
 * - x: The position of the object from left to right.
 * - y: The position of the object from bottom to top.
 * - z: The position of the object from back to front.
 * Position property can be used in the Camera and Mesh objects.
 * IMPORTANT! You must set the property values before rendering the scene.
 */

import * as THREE from 'three'

console.log("Hola");
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
/** EXAMPLE GROUP OF CUBES */
const group = new THREE.Group()
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0ff000 })
)
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
)
cube3.position.x = 2

group.add(cube3)

/** EXAMPLE GROUP OF CUBES: END */


/** EXAMPLE SINGLE CUBE */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

// Position property
// Adding position values to Mesh
// mesh.position.x = .7
// mesh.position.y = -.6
// mesh.position.z = -1
// Another way to set the position is using the "set" method.
// Is important to know that the order of the values is x, y, z.
mesh.position.set(0.9, -0.6, -1);

// Where do you think the object will be placed?

// Scale property
// The scale property is a vector that represents the scale of the object in 3D space.
// It has the following properties: x, y, z.
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;
mesh.scale.set(2, 0.7, 0.5);

// Rotation property
// The rotation property is a vector that represents the rotation of the object in 3D space.
// It has the following properties: x, y, z.
mesh.rotation.reorder('YXZ');
mesh.rotation.x = Math.PI * 1;
mesh.rotation.y = Math.PI * 1;
mesh.rotation.z = Math.PI * 1;
// mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, Math.PI * 0.25);

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);


// Position is a Vector3 object and has lots of methods to use.
// Url: https://threejs.org/docs/#api/en/objects/Mesh
console.log(mesh.position.length()); // this will give the distance between the position and the origin of the scene.

// "distanceTo" method is used to calculate the distance between two points.
// Params: Vector3 object
// Return: Number
console.log('Distance between the Origin - Cube: ' + mesh.position.distanceTo(new THREE.Vector3(0, 0, 0))); // this will give the distance between the position and the origin of the scene.

// normalize method is used to normalize the vector.
// "normalize" method will change the length of the vector to 1.
// mesh.position.normalize();

/** EXAMPLE SINGLE CUBE: END */

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
// camera.position.y = 1
// camera.position.x = 1
scene.add(camera)

// Look at method
// The lookAt method is used to make an object look at another object.
// Params: Vector3 object
// camera.lookAt(mesh.position);


console.log('Distance between the Camera - Cube: ' + mesh.position.distanceTo(camera.position)); // this will give the distance between the position and the camera.

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
/**
 * In this leasson we will learn Physics in Three.js
 *
 * You can create your own physics with some mathematics and solutions like Raycaster.
 * But if you want realistic physics you better use a library.
 *
 * We have 3D Libraries: Cannon.js, Ammo.js & Oimo.js
 *
 * We have 2D Libraries: Matter.js, Plank.js, Box2D & P2.js
 *
 * There are also another solution that combine the ThreeJS with a physics library like "Physi.js". But we will not use it in this leasson.
 *
 * In this leasson we are going to create:
 * - A physics world
 * - ThreeJS 3D world
 * - We will learn how to add a object to the world and to the physics world
 * - We are going to learn how to update simuntaneously the ThreeJS world and the physics world
 *
 * Interests:
 * https://schteppe.github.io/cannon.js/
 * https://github.com/pmndrs/cannon-es
 *  - comunity cannonjs: npm install --save "cannon-es" (in this leasson is used the version 0.15.1)
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'

/**
 * Debug
 */
const gui = new GUI()

const debugObject = {}
debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5,
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createSphere')

debugObject.createBox = () => {
    createBox(
        Math.random(),// width
        Math.random(),// height
        Math.random(),// depth
        {
            x: (Math.random() - 0.5) * 3,
            y: 3,
            z: (Math.random() - 0.5) * 3
        }
    )
}
gui.add(debugObject, 'createBox')

debugObject.reset = () => {
    for (const object of objectsToUpdate) {
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)
        scene.remove(object.mesh)
    }
    // reset the array
    objectsToUpdate.splice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
*/
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play();
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])


/**
 * Physics
*/
// ** WORLD **
const world = new CANNON.World()
// The broadphase is the algorithm that will check the collisions between the objects
// Improve the performance of the physics engine
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true // improve the performance of the physics engine
// gravity() is a method that returns a new CANNON.Vec3 what it means that we are creating a new vector
// parameters: x, y, z
// we set the gravity to -9.82 in the y axis because we want to simulate the gravity of Earth
// 9.82 m/s² is the constant of gravity on Earth
world.gravity.set(0, -9.82, 0)

// ** Materials **
// Materials are used to define the friction and the restitution of the objects
// Friction: how much the object will slide when it collides with another object
// Restitution: how much the object will bounce when it collides with another object
// The higher the value the more the object will bounce
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// ** Sphere **
// In ThreeJs we create objects but in CannonJs we create bodies
// Bodies are objects that will fall and collide with other bodies
// We have many Bodies like: Sphere, Box, Plane, Cylinder, etc.
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    // material: defaultMaterial
})
// Apply force to the sphereBody
sphereBody.applyLocalForce(new CANNON.Vec3(150, 0 , 0), new CANNON.Vec3(0, 0, 0))
// add the sphereBody to the world
// world.addBody(sphereBody)

// At you can see nothings has change because wee need to tell to ThreeJs
// to upate itselft with the physics world
// continue in the tick function

// ** Floor **
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
    // material: defaultMaterial
})
// we need to rotate the floorBody to be parallel to the x axis
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(-1, 0, 0), // axis X,Y,Z
    Math.PI * 0.5 // angle
)
world.addBody(floorBody)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5,
        map: textureLoader.load('/textures/environmentMaps/1/ny.png')
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
*/
const objectsToUpdate = []
// To improve we defined the geometry and the material outside the function
// And inside the function we scale the mesh using the radius parameter
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})

const createSphere = (radius, position) => {
    // Three.js
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in the objectsToUpdate array
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

const createBox = (width, height, depth, position) => {
    // Three.js
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    )
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // Cannon.js
    const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
    )
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in the objectsToUpdate array
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Add wind force
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)

    // Update physics world
    // Step parameters: fixed time step (1/60) and the time since the last step
    world.step(1 / 60, deltaTime, 3)

    // Update sphere
    // postion.copy() it copies the 3 axis values to the sphere object
    // sphere.position.copy(sphereBody.position)
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion) // able to rotate the object in collision
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
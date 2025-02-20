/**
 * In this leasson we are going to lear about the Raycaster
 *
 * Raycaster is a class that allows us to shoot a ray into the scene and see what it hits
 * You can use it to:
 * - Detect if there is a wall in front of the player
 * - Test if the laser gun hit something
 * - Test if something is currently under the mouse to simulate mouse events
 * - Show an alert message if the spaceship is heading toward a planet, etc
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
*/
const gltfLoader = new GLTFLoader()
let model = null
gltfLoader.load(
    './models/Duck/glTF/Duck.gltf',
    (gltf) => {
        model = gltf.scene
        model.position.y = -1.2
        scene.add(model)
    }
)

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, .9)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.1)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)


/**
 * Raycaster
*/
const raycaster = new THREE.Raycaster()

// ------- A ---------- //
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize() // normalize  the vector, values between -1 and 1
// raycaster.set(rayOrigin, rayDirection)

// // update the matrix world of the objects
// object1.updateMatrixWorld()
// object2.updateMatrixWorld()
// object3.updateMatrixWorld()

// // cast a ray
// const intersect = raycaster.intersectObject(object2) // test if the ray hit the object
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3]) // test if the ray hit the objects
// console.log(intersects)


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
 * Mouse
*/
// const mouse = {x: 0, y: 0} // option 1
const mouse = new THREE.Vector2() // Option 2. Vector2() because mouse can use 2D coordinates: X and Y
window.addEventListener('mousemove', (event) =>
{
    // normalize value for X axis, value from -1 to 1
    mouse.x = event.clientX / sizes.width * 2 - 1
    // normalize value for Y axis, value from -1 to 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click on object1')
                break
            case object2:
                console.log('click on object2')
                break
            case object3:
                console.log('click on object3')
                break
        }
    }
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Cast a ray
    // ------- B ---------- //
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(10, 0, 0)
    // rayDirection.normalize()
    // raycaster.set(rayOrigin, rayDirection)
    // // shoot the ray
    // const objectsToTest = [object1, object2, object3]
    // const intersects = raycaster.intersectObjects(objectsToTest)
    // // Intereact with the objects when the ray hit them
    // objectsToTest.forEach(object => object.material.color.set('#ff0000')) // return to red by default
    // intersects.forEach(intersect => intersect.object.material.color.set('#0000ff')) // change to blue when the ray hit them

    // ------- C ---------- //
    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    objectsToTest.forEach(object => object.material.color.set('#ff0000')) // return to red by default
    intersects.forEach(intersect => intersect.object.material.color.set('#0000ff')) // change to blue when the ray hit them

    if (intersects.length) {
        if (!currentIntersect) {
            // console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            // console.log('mouse leave')
        }
        currentIntersect = null
    }

    if (model) {
        const modelIntersects = raycaster.intersectObject(model, true)
        if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
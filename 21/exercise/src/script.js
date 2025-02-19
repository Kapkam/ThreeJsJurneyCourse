/**
 * Three.js lets you create many primitive geometries, but for complex shapes, it's better to use dedicated 3D software.
 * In this lesson, we will use pre-made models and learn how to create models within 3D software in future lessons.
 *
 * Over time, many 3D model formats have been developed, each addressing different needs such as data embedding, weight, compression, compatibility, and copyrights.
 * Today, we have access to hundreds of model formats: https://en.wikipedia.org/wiki/List_of_file_formats#3D_graphics.
 * Some formats are specific to one software, some are lightweight but lack specific data, and some contain extensive data but are heavy. Formats can be open source, proprietary, binary, or ASCII.
 * If you need specific data and can't find a suitable format, you can create your own format.
 *
 * Popular formats you might encounter include:
 * - OBJ
 * - FBX
 * - STL
 * - PLY
 * - COLLADA
 * - 3DS
 * - GLTF (is becoming a standard) -> https://github.com/KhronosGroup/glTF-Sample-Assets
 *
 * We won't cover all these formats, as one format, GLTF, is becoming a standard and should meet most of your needs.
 *
 * Links:
 * https://threejs.org/editor/
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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
// Draco Loader is better to load if you have a huge model to load, if not, you can use the GLTFLoader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/') // Path to the draco decoder, obtained from node_modules threeJS

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader) // provide the draco loader to the gltf loader

let mixer = null

gltfLoader.load(
    // './models/FlightHelmet/glTF/FlightHelmet.gltf', // Work
    './models/Fox/glTF-Binary/Fox.glb', // Work
    // './models/Duck/glTF-Draco/Duck.gltf', // Error, but work after adding the draco decoder
    // './models/Duck/glTF-Embedded/Duck.gltf', // Work
    (gltf) => {
        // ad the object to the scene
        // scene.add(gltf.scene.children[0]) // Work for Duck
        // const children = [...gltf.scene.children]
        // children.forEach(child => {
        //     scene.add(child)
        // })
        // Add animations of the Fox model
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[2])
        action.play()
        // Scale de model, in this case the Fox, because it's too big
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
    },
    () => {
        console.log('progress')
    },
    (error) => {
        console.log('error')
        console.error(error)
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
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
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer != null) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
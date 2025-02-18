/**
 * In this leason we will learn on how to add shadows to our geomtris
 * the handicup is to see the proyection of the sahow in the plane
 *
 * There are only 3 types of lights that support shadows:
 * - Directional light
 * - Spot light
 * - Point light
 *
 * So when you want to create the shadows you ned to follow the next steps:
 * 1. Activate the renderer shadowMap
 * 2. Distinguish form the objects who will cast the shadow and who will receive the shadow
 *   2.1 The one that cast the shadow will have the property castShadow = true
 *   2.2 The one that receive the shadow will have the property receiveShadow = true
 * 3. Activate the shadow property in the light
 *
 * The problem of managing shadows is that it is very expensive in terms of performance.
 * So a good solution is to bake the shadows in the 3D software.
 * In this example we are going to use an alredy bake shadow image inside the static forlder, in textures.
 * To use it in the Plane object we need to specify the texture in the material parameter, the second one and using the MeshBasicMaterial
 *
 * Another solution for baked shados is to used a difuse gradiant that we will put under the object and move it with the object.
 * To do this we are goin to create another plane with this texture and put it under the main object we want to cast the shadow.
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
// Set the texture color space to SRGB
bakedShadow.colorSpace = THREE.SRGBColorSpace
simpleShadow.colorSpace = THREE.SRGBColorSpace

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
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, .8)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(directionalLight)

// Activate the shadow property in the light
directionalLight.castShadow = true

// To imporve the quality of the shaow we need to add the next properties
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
// To avoid shadow glitches we need to add the next properties
// This It won't really improve the shadow's quality, but it might fix bugs where you can't see the shadow or where the shadow appears suddenly cropped.
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

// Reduce the render camear size to improve the shadow quality
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.left = - 2

// Add radius to the shadow to make it blurry
directionalLight.shadow.radius = 10

// To help us debug, we can use a CameraHelper with
// the camera used for the shadow map located in: directionallight.shadow.camera
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3)

// Activate the shadows
spotLight.castShadow = true

spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

// chage the shadow map size
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024

// change the shadow camera near and far
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 5


// Add camera helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
scene.add(spotLightCameraHelper)

// Point light
const pointLight = new THREE.PointLight(0xffffff, 2.7)
// Activate the shadows
pointLight.castShadow = true
pointLight.position.set(- 1, 1, 0)
scene.add(pointLight)

// Change the shadow map size
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024

// Change the shadow camera near and far
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 4

// Add the pointlight helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
// The sphere will cast a shadow
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

// The plane will receive the shadow
plane.receiveShadow = true

scene.add(sphere, plane)

// Sphere shadow plane
const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        alphaMap: simpleShadow,
        transparent: true,
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)


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

// Active shadows
renderer.shadowMap.enabled = false

// Sahdow map type
// renderer.shadowMap.type = THREE.PCFSoftShadowMap


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update the sphere position
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) // to make the sphere bounce

    // Update the sphere shadow position
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.6
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
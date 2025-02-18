import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({
    width: 400,
    title: 'Lighting'
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9)
directionalLight.position.set(1, .2, 0) // X, Y, Z
scene.add(directionalLight)

// hemisphere light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9)
scene.add(hemisphereLight)

// Point light
const pointLight = new THREE.PointLight(0xff9000, 1.5, 3, 1)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

// RectAreaLight (only works in MeshStandardMaterial & MeshPhysicalMaterial)
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight)

// Spot light
const spotLight = new THREE.SpotLight(0x78ff00, 4.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3);
// To move the light to a specific point we need to set the target of the light, and move the target to the desired position
spotLight.target.position.x = -1.5;
scene.add(spotLight)
scene.add(spotLight.target)

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereLightHelper)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalLightHelper)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointLightHelper)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

// Ligths with better performance are: AmbientLight, HemisphereLight
// Lights with medium performance are: DirectionalLight, PointLight
// Lights with worse performance are: SpotLight, RectAreaLight

// Tweak the light
const ambientLightTweak = gui.addFolder('Ambient Light')
ambientLightTweak.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('Ambient Light Intensity')
ambientLightTweak.addColor(ambientLight, 'color').name('Ambient Light Color')
const directionalLightTweak = gui.addFolder('Directional Light')
directionalLightTweak.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('Directional Light Intensity')
directionalLightTweak.addColor(directionalLight, 'color').name('Directional Light Color')
const hemisphereLightTweak = gui.addFolder('Hemisphere Light')
hemisphereLightTweak.add(hemisphereLight, 'intensity').min(0).max(3).step(0.001).name('Hemisphere Light Intensity')
hemisphereLightTweak.addColor(hemisphereLight, 'groundColor').name('Hemisphere Ground Color')
// hemisphereLightTweak.addColor(hemisphereLight, 'skyColor').name('Hemisphere Sky Color')
const pointLightTweak = gui.addFolder('Point Light')
pointLightTweak.add(pointLight, 'intensity').min(0).max(3).step(0.001).name('Point Light Intensity')
pointLightTweak.add(pointLight, 'distance').min(0).max(10).step(0.001).name('Point Light Distance')
pointLightTweak.add(pointLight, 'decay').min(0).max(10).step(0.001).name('Point Light Decay')
pointLightTweak.addColor(pointLight, 'color').name('Point Light Color')
pointLightTweak.add(pointLight.position, 'x').min(-3).max(3).step(0.001).name('Point Light X')
pointLightTweak.add(pointLight.position, 'y').min(-3).max(3).step(0.001).name('Point Light Y')
pointLightTweak.add(pointLight.position, 'z').min(-3).max(3).step(0.001).name('Point Light Z')
const rectAreaLightTweak = gui.addFolder('Rect Area Light')
rectAreaLightTweak.add(rectAreaLight, 'intensity').min(0).max(10).step(0.001).name('Rect Area Light Intensity')
rectAreaLightTweak.addColor(rectAreaLight, 'color').name('Rect Area Light Color')
rectAreaLightTweak.add(rectAreaLight, 'width').min(0).max(10).step(0.001).name('Rect Area Light Width')
rectAreaLightTweak.add(rectAreaLight, 'height').min(0).max(10).step(0.001).name('Rect Area Light Height')
rectAreaLightTweak.add(rectAreaLight.position, 'x').min(-3).max(3).step(0.001).name('Rect Area Light X')
rectAreaLightTweak.add(rectAreaLight.position, 'y').min(-3).max(3).step(0.001).name('Rect Area Light Y')
rectAreaLightTweak.add(rectAreaLight.position, 'z').min(-3).max(3).step(0.001).name('Rect Area Light Z')
const spotLightTweak = gui.addFolder('Spot Light')
spotLightTweak.add(spotLight, 'intensity').min(0).max(10).step(0.001).name('Spot Light Intensity')
spotLightTweak.add(spotLight, 'distance').min(0).max(10).step(0.001).name('Spot Light Distance')
spotLightTweak.add(spotLight, 'angle').min(0).max(Math.PI).step(0.001).name('Spot Light Angle')
spotLightTweak.add(spotLight, 'penumbra').min(0).max(1).step(0.001).name('Spot Light Penumbra')
spotLightTweak.add(spotLight, 'decay').min(0).max(10).step(0.001).name('Spot Light Decay')
spotLightTweak.addColor(spotLight, 'color').name('Spot Light Color')



/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
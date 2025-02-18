/**
 * In this leasson we will create a hounted houdse using  primitive geometries ad the materials,
 * we are going to use are from: https://polyhaven.com/
 *
 * For this project we are going to stablish that 1 unit is equal to 1 meter.
 *
 * Textures:
 * https://brunosimon.notion.site/Assets-953f65558015455eb65d38a7a5db7171
 *
 * Trigonometry website:
 * https://www.desmos.com/calculator?lang=es
 *
 * Sky texture:
 * https://threejs.org/examples/?q=sky#webgl_shaders_sky
 * code: https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html
 *
 * Image compression:
 * https://cloudconvert.com/jpg-to-webp
 * https://squoosh.app/
 * https://tinypng.com/
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import { Sky } from 'three/addons/objects/Sky.js'
import GUI from 'lil-gui'
import {
    floorAlphaTexture,
    floorColorTexture,
    floorARMTexture,
    floorNormalTexture,
    floorDisplacementTexture,
    wallColorTexture,
    wallARMTexture,
    wallNormalTexture,
    wallDisplacementTexture,
    roofColorTexture,
    roofARMTexture,
    roofNormalTexture,
    roofDisplacementTexture,
    bushColorTexture,
    bushARMTexture,
    bushNormalTexture,
    graveColorTexture,
    graveARMTexture,
    graveNormalTexture,
    doorColorTexture,
    doorAlphaTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorNormalTexture,
    doorMetalnessTexture,
    doorRoughnessTexture
} from './textures.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// add axis helper
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

/**
 * Textures
*/


/**
 * House
*/
const houseMesurement = {
    width: 4,
    height: 2.5,
    depth: 4
}

const graveMesurement = {
    width: 0.6,
    height: 0.8,
    depth: 0.2
}

//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100), // 20 meters x 20 meters
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap:floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture, // height map the vertises
        displacementScale: 0.4, // make less height
        displacementBias: 0, // make less height
        wireframe: false
     })
)
// rotate half a turn
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

const floorTweak = gui.addFolder('Floor')
floorTweak.add(floor.material, 'wireframe').name('Wireframe')
floorTweak.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Displacement Scale')
floorTweak.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Displacement Bias')

// House container
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseMesurement.width, houseMesurement.height, houseMesurement.depth), // 6 meters x 3 meters x 6 meters
    new THREE.MeshStandardMaterial({
        color: '#ac8e82',
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })
)
walls.position.y += houseMesurement.height / 2 // elevate the walls half of the height stablished in the Y axis
house.add(walls)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(houseMesurement.width * 0.85, houseMesurement.height * 0.5, 4), // 3 meters x 1,5 meters x 4 sides
    new THREE.MeshStandardMaterial({
        color: '#8a4629',
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
)
roof.rotation.y = Math.PI * 0.25 // rotate 45 degrees
roof.position.y += houseMesurement.height + (houseMesurement.height * 0.5) / 2 // elevate the roof, walls height + half of roof height
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100), // 1 meter x 2 meters x 10 cm
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .15,
        displacementBias: -0.04,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.position.y += 1 // door height / 2
door.position.z += houseMesurement.depth / 2 + 0.01 // house depth / 2 + 0,01 to avoid z-fighting
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16) // 1 meter diameter
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.2, .2, 2.2)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.8, .1, 2.1)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-1.2, .2, 2.2)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1.4, .05, 2.6)
bush4.rotation.x = -0.75
house.add(bush1, bush2, bush3, bush4)

// Graves
const graveGeometry = new THREE.BoxGeometry(graveMesurement.width, graveMesurement.height, graveMesurement.depth) // 60 cm x 80 cm x 20 cm
const graveMaterial = new THREE.MeshStandardMaterial({
    color: '#b2b6b1',
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2 // random angle
    // The radius of the hause is 2 but we want to place the graves outside the house so we set to 3
    // and we add a random value between 0 and 4
    const radius = 3 + Math.random() * 4 // random radius between 3 and 7
    const x = Math.sin(angle) * radius // random value X axis
    const z = Math.cos(angle) * radius // random value Z axis

    // Mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.z = z
    grave.position.y = Math.random() * (graveMesurement.height / 2) // elevate the grave randomly
    grave.rotation.x = (Math.random() - 0.5) * 0.4 // rotate slightly randomly
    grave.rotation.y = (Math.random() - 0.5) * 0.4 // rotate slightly randomly


    // Add to graves group
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#6299bf', 0.175)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#6299bf', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Point light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, houseMesurement.height - 0.2, 2.5)
house.add(doorLight)

/**
 * Ghost
 *
*/
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)


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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
 * Shadows
*/
// Enable shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap // better performance

//Chooosing what objects cast shadows & receive shadows
//Cast shadows
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true

// Receive shadows
walls.receiveShadow = true
floor.receiveShadow = true
roof.receiveShadow = true

// Apply shadows in gravs group
for(const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Mapping (direcional light)
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

// Mapping (ghosts light) better for performance
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
*/
const sky = new Sky()
// sky.scale.set(100, 100, 100)
sky.scale.setScalar(100)
scene.add(sky)

// Tweaks for the sky ( see in future lessons, in shaders unit )
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Fog
*/
// scene.fog = new THREE.Fog('#02343f', 1, 15) // color, near (where the fog starts), far (where the fog ends)
scene.fog = new THREE.FogExp2('#02343f', .15) // color, density

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update ghosts
    const ghostAngle1 = elapsedTime * 0.5 // we slow it down by multiplying by 0.5
    ghost1.position.x = Math.cos(ghostAngle1) * 4 // circle with radius 4
    ghost1.position.z = Math.sin(ghostAngle1) * 4 // circle with radius 4
    ghost1.position.y = Math.sin(ghostAngle1) * Math.sin(ghostAngle1 * 1.56) * Math.sin(ghostAngle1 * 3.45) // make it bounce

    const ghostAngle2 = - elapsedTime * 0.23 // we slow it down by multiplying by 0.5
    ghost2.position.x = Math.cos(ghostAngle2) * 5 // circle with radius 6
    ghost2.position.z = Math.sin(ghostAngle2) * 5 // circle with radius 6
    ghost2.position.y = Math.sin(ghostAngle2) * Math.sin(ghostAngle2 * 0.79) * Math.sin(ghostAngle2 * 2.45) // make it bounce

    const ghostAngle3 = elapsedTime * 0.38 // we slow it down by multiplying by 0.5
    ghost3.position.x = Math.cos(ghostAngle3) * 6 // circle with radius 8
    ghost3.position.z = Math.sin(ghostAngle3) * 6 // circle with radius 8
    ghost3.position.y = Math.sin(ghostAngle3) * Math.sin(ghostAngle3 * 3.6) * Math.sin(ghostAngle3 * 0.45) // make it bounce

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
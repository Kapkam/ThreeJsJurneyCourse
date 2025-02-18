/**
 * In this leasson we will learn how to create particles.
 *
 * Particles are precisely what you expect from that name. They are very popular and can be used to achieve various effects such as stars, smoke, rain, dust, fire, and many other things.
 * Creating particles is as simple as making a Mesh. We need a BufferGeometry, a material that can handle particles (PointsMaterial), and instead of producing a Mesh we need to create a Points.
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({
    title: 'Control Panel',
    width: 300
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particlesParticlesTexture = textureLoader.load('/textures/particles/11.png')

/**
 * Box testing
*/
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const box = new THREE.Mesh(
    boxGeometry,
    new THREE.MeshBasicMaterial()
)
// scene.add(box)


/**
 * Particles
*/

// Geometry ( option 1 )
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)

// Geometry ( option 2 )
// creating own geometry for the particles
const count = 5000 // number of particles
const particlesGeometry = new THREE.BufferGeometry()
// create an array to store the positions of the particles
// we multiply by 3 because we need 3 values for each, XYZ
const positions = new Float32Array(count * 3)
// create an array to store the colors of the particles
// we multiply by 3 because we need 3 values for each, RGB
const colors = new Float32Array(count * 3)

// loop through the array and set the positions of the particles randomly
// we multiply count * 3 because we need 3 values for each particle (x, y, z)
for (let i = 0; i < (count * 3); i++) {
    positions[i] = (Math.random() - 0.5) * 10 // range from -50 to 50
    colors[i] = Math.random()
}

// set the positions to the geometry
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
// set the colors to the geometry
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)


// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: .02, // size of the particles
    sizeAttenuation: true, // create a perspective effect
    // color: '#ff88cc',
    vertexColors: true, // enable the colors of the particles
    alphaMap: particlesParticlesTexture,
    alphaTest: 0.001, // avoid the GPU to render the particles that are transparent
    // depthTest: false, // avoid the particles to be hidden by other particles
    depthWrite: false, // avoid the particles to hide other particles
    transparent: true,
    blending: THREE.AdditiveBlending // blending mode affect performance, it combines the colors of the particles
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Tweaking the particles
const particlesTweak = gui.addFolder('Particles');
particlesTweak.add(particlesMaterial, 'size').min(0).max(1).step(0.001).name('Size');
particlesTweak.add(particlesMaterial, 'sizeAttenuation').name('Size Attenuation');
particlesTweak.addColor(particlesMaterial, 'color').name('Color');
particlesTweak.add(particlesMaterial, 'depthWrite').name('Depth Write');
particlesTweak.add(particlesMaterial, 'depthTest').name('Depth Test');



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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // particles.rotation.y = elapsedTime * .2

    // IMPORTAN! Thi animation is a bad practice because it's not performant
    // Here we are updating thousands of particles. in next clases we will learn how to do it in a better way
    for (let i = 0; i < count; i++) {
        // we multiply by 3 because we need 3 values for each particle (x, y, z)
        // so we define a second index
        const i3 = i * 3

        // so i3 will be de X axis value of each particle
        // so if we want to acces the Y axis value it will be i3 + 1
        // and same idea for Z axis: i3 + 2

        const x = particlesGeometry.attributes.position.array[i3]
        // we plus the x value to offset the animation of each particle
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    // notify ThreeJS that position is updated
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
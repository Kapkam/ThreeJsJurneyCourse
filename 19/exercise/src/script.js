/**
 * In this leasson we are going to create scroll based animations
 *
 * We will learn:
 * - How to use ThreeJS as a background of a classic HTMl page
 * - Make the camera translate to follow the scroll
 * - Discorver some tricks to make it more immersive
 * - Add a parallax animation based on the cursor position
 * - Trigger some animations when arriving at the corresponfding sections
 */
import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded',
    lightColor: '#ffffff',
}

gui.addColor(parameters, 'materialColor').name('Material color').onChange(() => {
    material.color.set(parameters.materialColor)
    particlesMaterial.color.set(parameters.materialColor)
})
gui.addColor(parameters, 'lightColor').name('Light color').onChange(() => {
    directionalLight.color.set(parameters.lightColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
// scene.add(cube)

/**
 * Objects
*/
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})


// Mesh
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 16),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(.8, 0.35, 100, 16),
    material
)

// mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
*/

// Geometry
const count = 2000

// Positions
const positions = new Float32Array(count * 3)

for(let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3 + 0] = (Math.random() - 0.5) * 10 // X
    positions[i3 + 1] = (objectsDistance * 0.5) - Math.random() * objectsDistance * sectionMeshes.length // Y
    positions[i3 + 2] = (Math.random() - 0.5) * 10 // Z
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Light
*/
const directionalLight = new THREE.DirectionalLight(parameters.lightColor, 3)
directionalLight.position.set(1, 1, 0)
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
 * Cursor
*/
const cursor = {
    x: 0,
    y: 0
}

// Update cursor position and get a value between -0.5 and 0.5
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // make the background transparent
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
*/
let scrollY = window.scrollY
let currentSection = 0

// Update scroll value when userr scrolls
window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    // Update current section
    const newSection = Math.round(scrollY / sizes.height)
    if (newSection != currentSection) {
        currentSection = newSection

        // Animate the meshes
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6', // prueba y error hasta que te guste el resultado
                y: '+=3', // prueba y error hasta que te guste el resultado
                z: '+=1.5' // prueba y error hasta que te guste el resultado
            }
        )
    }

    currentSection = scrollY / sizes.height
})

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

    // Update camera position
    camera.position.y =  - scrollY / sizes.height * objectsDistance

    // Parallax effect inside the camera group
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    // to make the move smoother based on the frecueny of the screen refresh rate
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    //Update objects
    for( const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
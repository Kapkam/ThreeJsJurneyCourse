/**
 * In this leasson we will generate a galaxy using particles
 * so we will put in practice what we have learned in previus lessons
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
 * Galaxy
*/
const parameters = {}
parameters.count = 100000 // number of particles
parameters.size = .01 // size of the particles
parameters.radius = 8 // radius of the galaxy
parameters.branches = 5 // number of branches
parameters.spin = 1 // spin of the galaxy
parameters.randomness = 0.6 // randomness of the particles
parameters.randomnessPower = 3 // randomness power
parameters.insideColoer = '#ec36d4'
parameters.outsideColor = '#6892f3'

let particlesGeometry = null
let material = null
let points = null

const generateGalaxy = () => {
    // Destroy old galaxy
    if (points !== null) {
        particlesGeometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    // Geometry
    particlesGeometry = new THREE.BufferGeometry()

    // create positions array
    const positions = new Float32Array( parameters.count * 3 )

    // create colors array
    const colors = new Float32Array( parameters.count * 3 )

    // create the inside color
    const colorInside = new THREE.Color(parameters.insideColoer)

    // create the outside color
    const colorOutside = new THREE.Color(parameters.outsideColor)

    // set the positions randomly
    // multiply by 3 because we need 3 values: XYZ
    for (let i = 0; i < parameters.count; i++) {
        const  i3 = i * 3

        // Obtain a random radius from 0 - 5
        const radius = Math.random() * parameters.radius

        // Calculamos el ángulo de rotación de la galaxia para cada partícula.
        // Las particulas más alejadas del centro de la galaxia tendrán un ángulo de rotación mayor.
        const spinAngle = radius * parameters.spin

        // Calculamos el ángulo de la rama para cada partícula.
        // Esto se hace utilizando la operación de módulo (i % parameters.branches) para obtener el residuo de la división de i entre el número de ramas (parameters.branches).
        // Luego, se divide este residuo por el número de ramas y se multiplica por 2π (Math.PI * 2) para obtener un ángulo en radianes.
        // De esta forma, las partículas se distribuyen uniformemente alrededor del centro de la galaxia en diferentes ramas.
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        // Randomness
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness

        // Set the position
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX // X
        positions[i3 + 1] = randomY // Y
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ// Z

        // mix colors
        const mixedColor = colorInside.clone()

        // El segundo parámetro de la función lerp necesita un valor entre 0 y 1.
        // "radius" es un valor aleatorio que puede variar entre 0 y el valor máximo definido por el usuario en "parameters.radius".
        // Para normalizar "radius" y asegurarnos de que esté en el rango de 0 a 1, dividimos "radius" por "parameters.radius".
        // Esto permite que la interpolación lineal (lerp) funcione correctamente, mezclando los colores en función de la distancia de la partícula desde el centro de la galaxia.
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        // Set the colors
        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    // add positions to the geometry
    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
    particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    // Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })

    // Points
    points = new THREE.Points(particlesGeometry, material)
    scene.add(points)
}

// Tweaks
const galaxyTweaks = gui.addFolder('Galaxy')
galaxyTweaks.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
galaxyTweaks.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
galaxyTweaks.add(parameters, 'radius').min(1).max(20).step(1).onFinishChange(generateGalaxy)
galaxyTweaks.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
galaxyTweaks.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
galaxyTweaks.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
galaxyTweaks.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
galaxyTweaks.addColor(parameters, 'insideColoer').onFinishChange(generateGalaxy)
galaxyTweaks.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


generateGalaxy()
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
camera.position.x = 3
camera.position.y = 3
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
    points.rotation.y = - elapsedTime * .1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
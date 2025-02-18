import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI({
    width: 300,
    title: 'Awesome GUI',
    closeFolders: false,

});

window.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        // we pass the hidden property to the show method
        // by default __hidden is false
        // is a way to toggle the visibility of the GUI
        gui.show(gui._hidden);
    }
});

const debugObject =  {};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = '#00fffb';


const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const cubeTweaks = gui.addFolder('Awesome Cube');

cubeTweaks.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation (Y)');
cubeTweaks.add(mesh, 'visible').name('visibility');
cubeTweaks.add(material, 'wireframe').name('wireframe');
cubeTweaks.addColor(debugObject, 'color').name('Color').onChange(() => {
    material.color.set(debugObject.color);
});

debugObject.spin = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2});
}

cubeTweaks.add(debugObject, 'spin').name('Spin');

debugObject.subdivision = 2;
cubeTweaks.add(debugObject, 'subdivision').min(1).max(20).step(1)
    .onFinishChange(() => {
        console.log('subdivision', debugObject.subdivision);
        // delete de old mesh geometry
        mesh.geometry.dispose();
        // create a new mesh geometry
        mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObject.subdivision, debugObject.subdivision, debugObject.subdivision);
    });

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
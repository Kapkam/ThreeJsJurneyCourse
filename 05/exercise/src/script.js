/**
 *  In this leasson we will learn how to animate in Three.js
 *
 * To understan this, we need to know that the render() function is called once per frame, so we can use it to animate objects.
 * Is important to know that computers will have different frame rates, so we need to use the clock to make the animation frame rate independent.
 * In this leasson we will use the function window.requestAnimationFrame() to animate the cube.
 */

import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Clock
// const clock = new THREE.Clock();
gsap.to(mesh.position, { duration:1, delay:1, x: 2 });
gsap.to(mesh.position, { duration:1, delay:2, x: 0 });

// Animations
// The objective is to create a function that call requestAnimationFrame() inside de funcion to animate the next frame the element we want.
const tick = () => {

    // Clock
    // const elapsedTime = clock.getElapsedTime();

    // Updates objects
    // mesh.position.y = Math.sin(elapsedTime);
    // mesh.position.x = Math.cos(elapsedTime);

    // Render
    renderer.render(scene, camera)


    // Here we call the function requestAnimationFrame() to animate the next frame
    // So this will couse a infinite loop that will animate the cube
    window.requestAnimationFrame(tick)
}

tick()
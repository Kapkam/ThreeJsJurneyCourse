/**
 * In this leasson we are going to reproduce this example:
 * Link: https://www.ilithya.rocks/
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


/**
 * Cursor
*/
const cursor = {
    x: 0,
    y: 0
}

/**
 * Base
 */
// Debug
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



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// Default
const matcapTexture = textureLoader.load('./textures/matcaps/7.png')
// Textures used as map and matcap are supposed to be encoded in sRGB.
// In the latest versions of Three.js we need to specify it by setting their colorSpace to THREE.SRGBColorSpace:
matcapTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
// camera.lookAt(textGeometry.position)
scene.add(camera)

// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Fonts
*/
const fontLoader = new FontLoader()

fontLoader.load(
    './fonts/helvetiker_regular.typeface.json',
    (font) => {
        const debugObject =  {
            text: 'Slime donuts!',
        };
        let textGeometry = new TextGeometry(debugObject.text, {
            font: font,
            size: .5,
            depth: .2,
            curveSegment: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4

        })
        // calculate boundy
        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5,
        // )
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        // console.time('donuts')

        //Spin effect
        debugObject.spin = () => {
            gsap.to(text.rotation, { y: text.rotation.y + Math.PI * 2});
        }

        const textTweaks = gui.addFolder('Text')
        textTweaks.add(text.position, 'x').min(-3).max(3).step(0.01).name('Text position X axis')
        textTweaks.add(text.position, 'y').min(-3).max(3).step(0.01).name('Text position Y axis')
        textTweaks.add(text.position, 'z').min(-3).max(3).step(0.01).name('Text position Z axis')
        textTweaks.add(text.rotation, 'x').min(0).max(Math.PI * 2).step(0.01).name('Text rotation X axis')
        textTweaks.add(text.rotation, 'y').min(0).max(Math.PI * 2).step(0.01).name('Text rotation Y axis')
        textTweaks.add(text.rotation, 'z').min(0).max(Math.PI * 2).step(0.01).name('Text rotation Z axis')
        textTweaks.add(text.scale, 'x').min(0).max(3).step(0.01).name('Text scale X axis')
        textTweaks.add(text.scale, 'y').min(0).max(3).step(0.01).name('Text scale Y axis')
        textTweaks.add(text.scale, 'z').min(0).max(3).step(0.01).name('Text scale Z axis')
        textTweaks.add(debugObject, 'spin').name('Spin Text');

        // IMPORTANT TO DO NOT ADD THIS CODE INSIDE A LOOP TO BETTER PERFORMANCE
        const donutGeometry = new THREE.TorusGeometry(.3, .2, 20, 45);

        // Adding donuts
        for (let index = 0; index < 1000; index++) {
            const donut = new THREE.Mesh(donutGeometry, material)
            // to avoid donuts to be in the same position
            donut.position.x = (Math.random() - 0.5) * 20
            donut.position.y = (Math.random() - 0.5) * 20
            donut.position.z = (Math.random() - 0.5) * 20
            // to avoid donuts to be in the same rotation
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            // to avoid donuts to be in the same scale (different sizes)
            const scale = Math.random()
            donut.scale.set(scale, scale, scale) // X, Y, Z
            // add donut to the scene
            scene.add(donut)
        }
        // console.timeEnd('donuts')

        window.addEventListener('mousemove', (event) =>{
            cursor.x = event.clientX / window.innerWidth - 0.5
            // Invert the y axis because when the mouse is at the top of the screen, the y value is 0, and when the mouse is at the bottom of the screen, the y value is 1
            cursor.y = -1 * (event.clientY / window.innerHeight - 0.5)
        })

        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        /**
         * Window
        */
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

        window.addEventListener('dblclick', () => {
            // To ensure that in Safari browser works
            const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
            if (!fullscreenElement) {
                // Therefore we have to ensure that exists the requestFullscreen method
                if (canvas.requestFullscreen) {
                    console.log('go fullscreen');
                    canvas.requestFullscreen();
                } else if (canvas.webkitRequestFullscreen) {
                    console.log('go fullscreen Safari');
                    canvas.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    console.log('leave fullscreen');
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    console.log('leave fullscreen Safari');
                    document.webkitExitFullscreen();
                }
            }
        })

        /**
         * Animate
         */
        const clock = new THREE.Clock()

        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()

            // Update controls
            controls.update()

            // Update Camera
            camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5;
            camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5;
            camera.position.y = cursor.y * 10;
            // camera.lookAt(textGeometry.boundingBox.max)
            camera.lookAt(new THREE.Vector3())

            // Update textureloader


            // Render
            renderer.render(scene, camera)

            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }

        tick()
    }
)


import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
 const dracoLoader = new DRACOLoader()
 dracoLoader.setDecoderPath('/draco/')
 
 const gltfLoader = new GLTFLoader()
 gltfLoader.setDRACOLoader(dracoLoader)

 gltfLoader.load(
    //'/models/Fox/glTF/Fox.gltf',
    '/static/folio.gltf',
    (gltf) =>
    {
        console.log(gltf)
        
        scene.add(gltf.scene)
        // //scene.add(gltf.scene.children[0])
        // const bakedMesh =gltf.scene.children[4]
        // const textureLoader = new THREE.TextureLoader()
        // const baked = textureLoader.load('/models/Palette.jpg')
        // const bake = new THREE.MeshBasicMaterial({map: baked})
        // //scene.add(bake)

        // bakedMesh.material = bake

        // gltf.scene.scale.set(0.025,0.025, 0.025)
        // //scene.add(gltf.cameras[0])
        // // while (gltf.scene.children.lengh){
        // //     scene.add(gltf.scene.children[0])
        // // }

        // // Animation
        // // mixer = new THREE.AnimationMixer(gltf.scene)
        // // const action = mixer.clipAction(gltf.animations[2])
        // // action.play()
    }
)

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
 * Cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: 0xff0000 })
// )
// scene.add(cube)

//Texture loader
const loader = new THREE.TextureLoader()
const height = loader.load('/bakeinvert.jpeg')
const Theight = loader.load('/height.jpeg')
const texture = loader.load('/bake.jpg')
const ttexture = loader.load('/Texture_mask_rock.jpg')
const normal = loader.load('/mask_mix_map.jpg')
const color = loader.load('/mask_grass_map1.jpg')
const roughness = loader.load('/grass.jpeg')
const alpha = loader.load('/mask_path.jpg')

const material = new THREE.MeshStandardMaterial({
    map: texture,
    displacementMap: ttexture,
    displacementScale: .25,
    normalMap: texture,
    alphaMap: alpha
    //colorMap: height,
    //roughnessMap: roughness
    //displacementBias: 0.8
})

//Plane
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3, 64, 64), material
    //new THREE.MeshBasicMaterial({color: 0x00ff00})
)
// const textureLoader = new THREE.TextureLoader()
// const baked = textureLoader.load('/bake.jpg')
// const bake = new THREE.MeshBasicMaterial({map: baked})

// const material = new THREE.MeshStandardMaterial()

// const displacementMap = new THREE.TextureLoader().load(
//     '/mask_grass_map1.jpg'
// )
// material.displacementMap = displacementMap

// const baker = new THREE.MeshStandardMaterial({map: displacementMap})

//const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, material)
scene.add(plane)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)


plane.rotation.x = - Math.PI * 0.5

// plane.material = baker
// plane.material = bake
scene.add(plane)
plane.position.set(0,0,0)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    console.log("Testing")

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
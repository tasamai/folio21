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

let mixer = null

gltfLoader.load(
    // '/models/Fox/glTF/Fox.gltf',
    '/walking.gltf',
    (gltf) =>
    {
        console.log(gltf)
        
        //scene.add(gltf.scene)
        //gltf.scene.remove(gltf.scene.children[2])

        // //---- Light-----
        // console.log(gltf.scene.children[2].position)
        // const lig = gltf.scene.children[2].position.set(-74, -104, 24)
        // //scene.add(lig)
        // console.log(gltf.scene.children[2].position)
        // console.log(gltf.scene.children[2].rotation)
        // //const rot = 
        // gltf.scene.children[2].rotation.set(-157, 246, -95)
        // console.log(gltf.scene.children[2].rotation)
        scene.add(gltf.scene)
        // console.log(gltf)
        // //scene.add(rot)

        //--- light end ----

        // //scene.add(gltf.scene.children[0])
        // const bakedMesh =gltf.scene.children[4]
        // const textureLoader = new THREE.TextureLoader()
        // const baked = textureLoader.load('/models/Palette.jpg')
        // const bake = new THREE.MeshBasicMaterial({map: baked})
        // //scene.add(bake)

        //bakedMesh.material = bake

        //gltf.scene.scale.set(0.025,0.025, 0.025)
        //scene.add(gltf.cameras[0])
        // while (gltf.scene.children.lengh){
        //     scene.add(gltf.scene.children[0])
        // }

        // Animation
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
    }
)
//const baked = new THREE.MeshBasicMaterial({map: /models/path/Heightmap.tif})
// const textureLoader = new THREE.TextureLoader()
// const baked = textureLoader.load('/models/bake.jpg')
// const bake = new THREE.MeshBasicMaterial({map: baked})
// scene.add(bake)
/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

// const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
// scene.add( light );

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// // directionalLight.castShadow = true
// // directionalLight.shadow.mapSize.set(1024, 1024)
// // directionalLight.shadow.camera.far = 15
// // directionalLight.shadow.camera.left = - 7
// // directionalLight.shadow.camera.top = 7
// // directionalLight.shadow.camera.right = 7
// // directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(-74, -104, 24)
// scene.add(directionalLight)





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
camera.position.set(3, 12, 3)
//camera.scale(1,1,1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

    // Model animation
    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
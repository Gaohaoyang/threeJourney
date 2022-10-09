/* eslint-disable no-param-reassign */
import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import stats from '../common/stats'
import { listenResize } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Gui
const gui = new dat.GUI()
const debugObject = {
  envMapIntensity: 1.5,
}

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(8, 2, -4)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.3
// controls.target = new THREE.Vector3(0, 3, 0)
// controls.autoRotate = true

/**
 * Objects
 */
// const testSphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '../assets/textures/environmentMaps/3/px.jpg',
  '../assets/textures/environmentMaps/3/nx.jpg',
  '../assets/textures/environmentMaps/3/py.jpg',
  '../assets/textures/environmentMaps/3/ny.jpg',
  '../assets/textures/environmentMaps/3/pz.jpg',
  '../assets/textures/environmentMaps/3/nz.jpg',
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
// scene.environment = environmentMap

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      console.log(child)
      child.material.envMap = environmentMap
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001)
  .onChange(updateAllMaterials)

/**
 * Models
 */
gltfLoader.load('../assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  gltf.scene.scale.set(8, 8, 8)
  gltf.scene.position.set(0, -3.4, 0)
  gltf.scene.rotation.set(0, Math.PI * 0.5, 0)
  gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001)
    .name('rotation')
  scene.add(gltf.scene)
  updateAllMaterials()
})

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight('#ffffff', 2.8)
directionLight.position.set(0.25, 3, -2.25)
scene.add(directionLight)

gui.add(directionLight, 'intensity').min(0).max(10).step(0.001)
  .name('lightIntensity')
gui.add(directionLight.position, 'x').min(-5).max(5).step(0.001)
  .name('lightX')
gui.add(directionLight.position, 'y').min(-5).max(5).step(0.001)
  .name('lightY')
gui.add(directionLight.position, 'z').min(-5).max(5).step(0.001)
  .name('lightZ')
directionLight.castShadow = true

const directionalLightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = false

directionLight.shadow.camera.far = 15
directionLight.shadow.mapSize.set(1024, 1024)

/** axesHelper */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
axesHelper.visible = false

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.5
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

gui.add(renderer, 'toneMapping', {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
})
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
gui.add(controls, 'autoRotate')

// Animations
const tick = () => {
  stats.begin()
  controls.update()

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()

listenResize(sizes, camera, renderer)

// gui.add(directionLightHelper, 'visible').name('lightHelper visible')
gui.add(directionalLightCameraHelper, 'visible').name('lightCameraHelper visible')
gui.add(axesHelper, 'visible').name('axesHelper visible')
gui.add(controls, 'autoRotate')

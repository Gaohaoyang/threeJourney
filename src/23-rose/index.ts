/* eslint-disable no-param-reassign */
import * as THREE from 'three'
// import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import stats from '../common/stats'
import { listenResize } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Gui
const gui = new dat.GUI()
gui.close()
gui.hide()
const debugObject = {
  envMapIntensity: 1.5,
}

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 100)
camera.position.set(5, 3.8, 0)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.3

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Started loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`)
}

const loadingEle = document.querySelector('#loading') as HTMLDivElement
loadingManager.onLoad = () => {
  console.log('Loading complete!')
  console.log('success')
  setTimeout(() => {
    loadingEle.style.opacity = '0'
    setTimeout(() => {
      loadingEle.style.display = 'none'
    }, 200)
  }, 200)
}

const progressEle = document.querySelector('#progress-bar-inner') as HTMLDivElement
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`Loading file: ${url}.\nLoaded ${itemsLoaded} of ${itemsTotal} files.`)
  // progress-bar-inner
  // transform 0% -> 100%
  if (itemsTotal > 2) {
    progressEle.style.transform = `translateX(${(itemsLoaded / itemsTotal) * 100}%)`
  }
}

loadingManager.onError = (url) => {
  console.log(`There was an error loading ${url}`)
}

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader(loadingManager)

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
      console.log(child)
      child.material.envMapIntensity = debugObject.envMapIntensity
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}

let model: THREE.Group

/**
 * Models
 */
gltfLoader.load(
  'https://cdn.jsdelivr.net/gh/Gaohaoyang/pics/models/rose/scene.gltf',
  (gltf) => {
    gltf.scene.scale.set(3.5, 3.5, 3.5)
    gltf.scene.position.set(0, -2.5, 0)
    gltf.scene.rotation.set(0, Math.PI * 0.5, 0)
    model = gltf.scene
    setTimeout(() => {
      scene.add(gltf.scene)
    }, 200)
    updateAllMaterials()
  },
  (progress) => {
    console.log('progress')
    console.log(progress)
  },
)

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight('#FFF9C4', 10)
directionLight.position.set(0.25, 3, -2.25)
scene.add(directionLight)

directionLight.castShadow = true

const directionalLightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
scene.add(directionalLightCameraHelper)
directionalLightCameraHelper.visible = false

directionLight.shadow.camera.far = 15
directionLight.shadow.mapSize.set(1024, 1024)

directionLight.shadow.normalBias = 0.05

/** axesHelper */
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
axesHelper.visible = false

const ambientLight = new THREE.AmbientLight('#FFF9C4', 1)
scene.add(ambientLight)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 2.5
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// rotation control
const rotation = {
  autoRotation: true,
}
gui.add(rotation, 'autoRotation')

// Animations
const tick = () => {
  // stats.begin()
  controls.update()

  if (model && rotation.autoRotation) {
    model.rotation.y += 0.005
  }

  // Render
  renderer.render(scene, camera)
  // stats.end()
  requestAnimationFrame(tick)
}

tick()

listenResize(sizes, camera, renderer)

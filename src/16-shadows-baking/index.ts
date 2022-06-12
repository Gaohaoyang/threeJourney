import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Texture
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('../assets/textures/bakedShadow.jpg')

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
// sphere.castShadow = true

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({
  map: bakedShadow,
}))
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(0, -0.5, 0)
// plane.receiveShadow = true

scene.add(sphere, plane)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
directionalLight.position.set(1, 0.75, 1)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.width = 1024
// directionalLight.shadow.mapSize.height = 1024
// directionalLight.shadow.camera.near = 1
// directionalLight.shadow.camera.far = 5
// directionalLight.shadow.camera.top = 2
// directionalLight.shadow.camera.right = 2
// directionalLight.shadow.camera.bottom = -2
// directionalLight.shadow.camera.left = -2
// directionalLight.shadow.radius = 10
scene.add(directionalLight)

// console.log(directionalLight.shadow)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

// const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
// spotLight.distance = 6
// spotLight.position.set(0, 2, 2)
// spotLight.castShadow = true
// spotLight.shadow.mapSize.set(1024, 1024)
// spotLight.shadow.camera.fov = 30
// spotLight.shadow.camera.near = 1
// spotLight.shadow.camera.far = 6
// spotLight.shadow.radius = 10
// scene.add(spotLight)

// const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLightHelper)

// const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
// scene.add(spotLightCameraHelper)

// const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
// pointLight.position.set(-1, 1, 0)
// pointLight.castShadow = true
// pointLight.shadow.radius = 10
// pointLight.shadow.mapSize.width = 1024
// pointLight.shadow.mapSize.height = 1024
// pointLight.shadow.camera.near = 0.5
// pointLight.shadow.camera.far = 4
// scene.add(pointLight)

// const pointLightHelper = new THREE.PointLightHelper(pointLight)
// scene.add(pointLightHelper)

// const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(pointLightCameraHelper)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.8
// controls.enabled = false

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

listenResize(sizes, camera, renderer)

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

/**
 * Debug
 */
const gui = new dat.GUI()

const autoRotateFolder = gui.addFolder('AutoRotate')
autoRotateFolder.add(controls, 'autoRotate')
autoRotateFolder.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)

const meshFolder = gui.addFolder('Mesh')
meshFolder.add(material, 'metalness', 0, 1, 0.0001)
meshFolder.add(material, 'roughness', 0, 1, 0.0001)
meshFolder.add(material, 'wireframe')

const ambientLightFolder = gui.addFolder('AmbientLight')
ambientLightFolder.add(ambientLight, 'visible').listen()
ambientLightFolder.add(ambientLight, 'intensity', 0, 1, 0.001)

const directionalLightFolder = gui.addFolder('DirectionalLight')
directionalLightFolder
  .add(directionalLight, 'visible')
  .onChange((visible: boolean) => {
    directionalLightHelper.visible = visible
    // directionalLightCameraHelper.visible = visible
  })
  .listen()
directionalLightFolder.add(directionalLightHelper, 'visible').name('helper visible').listen()
// directionalLightFolder
//   .add(directionalLightCameraHelper, 'visible')
//   .name('camera helper visible')
//   .listen()
directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001)

// const spotLightFolder = gui.addFolder('SpotLight')
// spotLightFolder
//   .add(spotLight, 'visible')
//   .onChange((visible: boolean) => {
//     spotLightHelper.visible = visible
//     spotLightCameraHelper.visible = visible
//   })
//   .listen()
// spotLightFolder.add(spotLightHelper, 'visible').name('helper visible').listen()
// spotLightFolder.add(spotLightCameraHelper, 'visible').name('camera helper visible').listen()
// spotLightFolder.add(spotLight, 'intensity', 0, 5, 0.001)
// spotLightFolder.add(spotLight, 'distance', 0, 20, 0.001)
// spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.001)
// spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.001)
// spotLightFolder.add(spotLight, 'decay', 0, 10, 0.001)

// const pointLightFolder = gui.addFolder('PointLight')
// pointLightFolder
//   .add(pointLight, 'visible')
//   .onChange((visible: boolean) => {
//     pointLightHelper.visible = visible
//     pointLightCameraHelper.visible = visible
//   })
//   .listen()
// pointLightFolder.add(pointLightHelper, 'visible').name('helper visible').listen()
// pointLightFolder.add(pointLightCameraHelper, 'visible').name('camera helper visible').listen()
// pointLightFolder.add(pointLight, 'distance', 0, 100, 0.00001)
// pointLightFolder.add(pointLight, 'decay', 0, 10, 0.00001)

// const guiObj = {
//   turnOffAllLights() {
//     ambientLight.visible = false
//     directionalLight.visible = false
//     directionalLightHelper.visible = false
//     directionalLightCameraHelper.visible = false
//     pointLight.visible = false
//     pointLightHelper.visible = false
//     pointLightCameraHelper.visible = false
//     spotLight.visible = false
//     spotLightHelper.visible = false
//     spotLightCameraHelper.visible = false
//   },
//   turnOnAllLights() {
//     ambientLight.visible = true
//     directionalLight.visible = true
//     directionalLightHelper.visible = true
//     directionalLightCameraHelper.visible = true
//     pointLight.visible = true
//     pointLightHelper.visible = true
//     pointLightCameraHelper.visible = true
//     spotLight.visible = true
//     spotLightHelper.visible = true
//     spotLightCameraHelper.visible = true
//   },
//   hideAllHelpers() {
//     directionalLightHelper.visible = false
//     directionalLightCameraHelper.visible = false
//     pointLightHelper.visible = false
//     pointLightCameraHelper.visible = false
//     spotLightHelper.visible = false
//     spotLightCameraHelper.visible = false
//   },
//   showAllHelpers() {
//     directionalLightHelper.visible = true
//     directionalLightCameraHelper.visible = true
//     pointLightHelper.visible = true
//     pointLightCameraHelper.visible = true
//     spotLightHelper.visible = true
//     spotLightCameraHelper.visible = true
//   },
// }

// guiObj.hideAllHelpers()

// gui.add(guiObj, 'turnOffAllLights')
// gui.add(guiObj, 'turnOnAllLights')
// gui.add(guiObj, 'hideAllHelpers')
// gui.add(guiObj, 'showAllHelpers')

gui.close()

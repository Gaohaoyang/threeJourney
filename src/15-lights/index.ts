import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.set(-1.5, 0, 0)

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 32, 64), material)
torus.position.set(1.5, 0, 0)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(0, -0.65, 0)

scene.add(sphere, cube, torus, plane)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

const hemisphereLight = new THREE.HemisphereLight('#B71C1C', '#004D40', 0.6)
scene.add(hemisphereLight)

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 2)
scene.add(hemisphereLightHelper)

const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
pointLight.position.set(1, 1, 1)
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

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
// controls.autoRotate = true
// controls.enabled = false

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)

// Clock
const clock = new THREE.Clock()

// Animations
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()

  // Update Objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  controls.update()
  spotLightHelper.update()

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
  })
  .listen()
directionalLightFolder.add(directionalLightHelper, 'visible').name('helper visible').listen()
directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001)

const hemisphereLightFolder = gui.addFolder('HemisphereLight')
hemisphereLightFolder
  .add(hemisphereLight, 'visible')
  .onChange((visible: boolean) => {
    hemisphereLightHelper.visible = visible
  })
  .listen()
hemisphereLightFolder.add(hemisphereLightHelper, 'visible').name('helper visible').listen()
hemisphereLightFolder.add(hemisphereLight, 'intensity', 0, 1, 0.001)

const pointLightFolder = gui.addFolder('PointLight')
pointLightFolder
  .add(pointLight, 'visible')
  .onChange((visible: boolean) => {
    pointLightHelper.visible = visible
  })
  .listen()
pointLightFolder.add(pointLightHelper, 'visible').name('helper visible').listen()
pointLightFolder.add(pointLight, 'distance', 0, 100, 0.00001)
pointLightFolder.add(pointLight, 'decay', 0, 10, 0.00001)

const rectAreaLightFolder = gui.addFolder('RectAreaLight')
rectAreaLightFolder
  .add(rectAreaLight, 'visible')
  .onChange((visible: boolean) => {
    rectAreaLightHelper.visible = visible
  })
  .listen()
rectAreaLightFolder.add(rectAreaLightHelper, 'visible').name('helper visible').listen()
rectAreaLightFolder.add(rectAreaLight, 'intensity', 0, 80, 0.0001)
rectAreaLightFolder.add(rectAreaLight, 'width', 0, 5, 0.0001)
rectAreaLightFolder.add(rectAreaLight, 'height', 0, 5, 0.0001)

const spotLightFolder = gui.addFolder('SpotLight')
spotLightFolder
  .add(spotLight, 'visible')
  .onChange((visible: boolean) => {
    spotLightHelper.visible = visible
  })
  .listen()
spotLightFolder.add(spotLightHelper, 'visible').name('helper visible').listen()
spotLightFolder.add(spotLight, 'intensity', 0, 5, 0.001)
spotLightFolder.add(spotLight, 'distance', 0, 20, 0.001)
spotLightFolder.add(spotLight, 'angle', 0, Math.PI / 2, 0.001)
spotLightFolder.add(spotLight, 'penumbra', 0, 1, 0.001)
spotLightFolder.add(spotLight, 'decay', 0, 10, 0.001)

const guiObj = {
  turnOffAllLights() {
    ambientLight.visible = false
    directionalLight.visible = false
    directionalLightHelper.visible = false
    hemisphereLight.visible = false
    hemisphereLightHelper.visible = false
    pointLight.visible = false
    pointLightHelper.visible = false
    rectAreaLight.visible = false
    rectAreaLightHelper.visible = false
    spotLight.visible = false
    spotLightHelper.visible = false
  },
  turnOnAllLights() {
    ambientLight.visible = true
    directionalLight.visible = true
    directionalLightHelper.visible = true
    hemisphereLight.visible = true
    hemisphereLightHelper.visible = true
    pointLight.visible = true
    pointLightHelper.visible = true
    rectAreaLight.visible = true
    rectAreaLightHelper.visible = true
    spotLight.visible = true
    spotLightHelper.visible = true
  },
}

gui.add(guiObj, 'turnOffAllLights')
gui.add(guiObj, 'turnOnAllLights')

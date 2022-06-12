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
const simpleShadow = textureLoader.load('../assets/textures/simpleShadow.jpg')

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

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.set(-Math.PI / 2, 0, 0)
plane.position.set(0, -0.5, 0)
// plane.receiveShadow = true

const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: '#000000',
    transparent: true,
    alphaMap: simpleShadow,
  })
)

shadowPlane.rotateX(-Math.PI / 2)
shadowPlane.position.y = plane.position.y + 0.01

scene.add(sphere, plane, shadowPlane)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
directionalLight.position.set(0, 1.3, 0)
scene.add(directionalLight)

// console.log(directionalLight.shadow)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
directionalLightHelper.visible = false
scene.add(directionalLightHelper)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.5, 2, 4)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

listenResize(sizes, camera, renderer)

// Clock
const clock = new THREE.Clock()

// Animations
const tick = () => {
  stats.begin()
  const elapsedTime = clock.getElapsedTime()

  sphere.position.x = Math.sin(elapsedTime) * 1.5
  sphere.position.z = Math.cos(elapsedTime) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 2.5))

  shadowPlane.position.x = sphere.position.x
  shadowPlane.position.z = sphere.position.z
  shadowPlane.material.opacity = (1 - sphere.position.y) * 0.6

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
directionalLightFolder.add(directionalLight, 'intensity', 0, 1, 0.001)

gui.close()

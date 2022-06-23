import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

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

/**
 * Particles
 */
// geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

// material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
})

const particles = new THREE.Points(sphereGeometry, pointMaterial)
scene.add(particles)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 1.8, 2)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.autoRotateSpeed = 0.2
controls.zoomSpeed = 0.3

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.body)

// Animations
const tick = () => {
  stats.begin()

  controls.update()
  pointMaterial.needsUpdate = true

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

gui.add(controls, 'autoRotate')
gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
gui.add(pointMaterial, 'size', 0.01, 0.1, 0.001)
gui.add(pointMaterial, 'sizeAttenuation')

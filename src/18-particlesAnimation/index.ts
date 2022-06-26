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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load(
  'https://gw.alicdn.com/imgextra/i3/O1CN01DO6Ed61QtcMKsVnK2_!!6000000002034-2-tps-56-56.png',
)

/**
 * Particles
 */
// geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000
const positions = new Float32Array(count * 3) // 每个点由三个坐标值组成（x, y, z）
const colors = new Float32Array(count * 3) // 每个颜色由三个rgb组成
for (let i = 0; i < count * 3; i += 1) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
})

// pointMaterial.color = new THREE.Color('#ff88cc')
// pointMaterial.map = particleTexture
pointMaterial.alphaMap = particleTexture
pointMaterial.transparent = true
// pointMaterial.alphaTest = 0.001
// pointMaterial.depthTest = false
pointMaterial.depthWrite = false
pointMaterial.blending = THREE.AdditiveBlending
pointMaterial.vertexColors = true

const particles = new THREE.Points(particlesGeometry, pointMaterial)
scene.add(particles)

// cube
// const cube = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial())
// scene.add(cube)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 1)
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
controls.autoRotateSpeed = 1
controls.zoomSpeed = 0.3

// const axesHelper = new THREE.AxesHelper(1)
// scene.add(axesHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  // antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.body)

// Animations
const clock = new THREE.Clock()
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  // particles.position.x = 0.1 * Math.sin(elapsedTime)

  for (let i = 0; i < count; i += 1) {
    const x = particlesGeometry.attributes.position.getX(i)
    particlesGeometry.attributes.position.setY(i, Math.sin(elapsedTime + x))
  }
  particlesGeometry.attributes.position.needsUpdate = true

  controls.update()
  // pointMaterial.needsUpdate = true

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
gui.close()

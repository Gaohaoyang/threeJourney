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

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.3
controls.autoRotateSpeed = 0.7
controls.autoRotate = true

/**
 * Galaxy
 */
const parameters = {
  count: 10000,
  size: 0.02,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: '#ff6030',
  outsideColor: '#1b3984',
}

let geometry: THREE.BufferGeometry
let material: THREE.PointsMaterial
let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>

const generatorGalaxy = () => {
  if (points) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  // Geometry
  geometry = new THREE.BufferGeometry()
  const position = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  for (let i = 0; i < parameters.count; i += 1) {
    const i3 = i * 3
    const radius = Math.random() * parameters.radius
    const branchesAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2
    const spinAngle = radius * parameters.spin

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    const randomX = Math.random() ** parameters.randomnessPower
      * (Math.random() < 0.5 ? 1 : -1)
      * parameters.randomness
      * radius
    const randomY = Math.random() ** parameters.randomnessPower
      * (Math.random() < 0.5 ? 1 : -1)
      * parameters.randomness
      * radius
    const randomZ = Math.random() ** parameters.randomnessPower
      * (Math.random() < 0.5 ? 1 : -1)
      * parameters.randomness
      * radius

    position[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomX
    position[i3 + 1] = randomY
    position[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomZ

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)
}

generatorGalaxy()

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

gui.add(parameters, 'count', 100, 100000, 100).onFinishChange(generatorGalaxy)
gui.add(parameters, 'size', 0.001, 0.1, 0.001).onFinishChange(generatorGalaxy)
gui.add(parameters, 'radius', 0.01, 20, 0.01).onFinishChange(generatorGalaxy)
gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generatorGalaxy)
gui.add(parameters, 'spin', -5, 5, 0.001).onFinishChange(generatorGalaxy)
gui.add(parameters, 'randomness', 0, 2, 0.001).onFinishChange(generatorGalaxy)
gui.add(parameters, 'randomnessPower', 1, 10, 0.001).onFinishChange(generatorGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generatorGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generatorGalaxy)
gui.close()

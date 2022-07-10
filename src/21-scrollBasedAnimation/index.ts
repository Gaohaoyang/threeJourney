import * as THREE from 'three'
import './style.css'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

/**
 * Debug
 */
const parameters = {
  materialColor: '#FFF59D',
}

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const isVertical = sizes.width < sizes.height

let objectsDistance = 5

// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 4)
if (isVertical) {
  camera.position.setZ(8)
  objectsDistance = 11
}
cameraGroup.add(camera)

/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load(
  'https://gw.alicdn.com/imgextra/i1/O1CN01Kv3xWT1kImpSDZI8n_!!6000000004661-0-tps-5-1.jpg'
)
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
})

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshToonMaterial>[] = [
  mesh1,
  mesh2,
  mesh3,
]

sectionMeshes.forEach((item, index) => {
  if (isVertical) {
    item.position.setY(-objectsDistance * index)
  } else {
    item.position.setX(index % 2 === 0 ? 2 : -2)
    item.position.setY(-objectsDistance * index)
  }
})

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight('#ffffff', 0.28)
scene.add(ambientLight)

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i += 1) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] =
    objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
})
// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.documentElement)

/**
 * Scroll
 */
let { scrollY } = window
let currentSection = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)
  if (newSection !== currentSection) {
    currentSection = newSection
    // console.log('changed', currentSection)
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
    })
  }
})

/**
 * Mouse
 */
const mouse = { x: 0, y: 0 } // -1 :: 1

if (isVertical) {
  /**
   * device orientation
   */
  window.addEventListener('deviceorientation', (event) => {
    // const { alpha } = event
    const { beta } = event
    const { gamma } = event
    // console.log(alpha, beta, gamma)
    // if (beta !== null && gamma !== null) {
    // this.orientationStatus = 1
    // this.rotate(beta, gamma)
    if (beta !== null && gamma !== null) {
      const x = (gamma || 0) / 20 // -180 :: 180
      const y = (Math.min(beta || 0, 89) - 45) / 30 //  -90 :: 90
      console.log(x, y)
      mouse.x = x
      mouse.y = -y
    }
  })
} else {
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
  })
}

// Animations
const clock = new THREE.Clock()
let previousTime = 0
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime
  // const deltaTime2 = clock.getDelta()
  // console.log(deltaTime);
  // console.log(deltaTime2);
  // console.log('----');

  // Animate meshes
  sectionMeshes.forEach((mesh) => {
    mesh.rotation.set(deltaTime * 0.1 + mesh.rotation.x, deltaTime * 0.1 + mesh.rotation.y, 0)
  })

  // animate camera
  camera.position.setY((-scrollY / sizes.height) * objectsDistance)

  if (mouse.x && mouse.y) {
    const parallaxX = mouse.x * 0.5
    const parallaxY = mouse.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
  }

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()

const gui = new dat.GUI()
gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
  particlesMaterial.color.set(parameters.materialColor)
})

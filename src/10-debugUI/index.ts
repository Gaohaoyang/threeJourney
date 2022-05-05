import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import stats from '../common/stats'
import { listenResize } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

const box = new THREE.BoxGeometry(1, 1, 1)
const defaultColor = 0x607d8b
const material = new THREE.MeshBasicMaterial({
  color: 0x607d8b,
})

// Object
const cubeMesh = new THREE.Mesh(box, material)
scene.add(cubeMesh)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100)
camera.position.set(0, 0, 3)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.enabled = false

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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
const gui = new dat.GUI({
  // closed: true,
  width: 400,
})
// gui.hide() // press H to show

gui.add(cubeMesh.position, 'y').min(-3).max(3).step(0.01)
  .name('cubeMesh Y') // 别名
gui.add(cubeMesh.position, 'x').min(-3).max(3).step(0.01)
gui.add(cubeMesh.position, 'z').min(-3).max(3).step(0.01)

gui.add(cubeMesh, 'visible') // boolean
gui.add(cubeMesh.material, 'wireframe') // boolean

const debugObj = {
  color: defaultColor,
  spin() {
    gsap.to(cubeMesh.rotation, {
      duration: 1,
      y: cubeMesh.rotation.y + Math.PI * 2,
    })
  },
}

gui.addColor(debugObj, 'color').onChange((e) => {
  cubeMesh.material.color.set(e)
})

gui.add(debugObj, 'spin') // function

import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad回调
  (font) => {
    console.log('loaded', font)
    const textGeometry = new TextGeometry("Joe CS's world!", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    })

    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load('../assets/textures/matcaps/1.png')

    const textMaterial = new THREE.MeshMatcapMaterial()
    textMaterial.matcap = matcapTexture
    // textMaterial.wireframe = true

    textGeometry.center()
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    // const box = new THREE.BoxHelper(text, 0xffff00)
    // scene.add(box)

    // textGeometry.computeBoundingBox() // 计算 box 边界
    // if (textGeometry.boundingBox) {
    //   textGeometry.translate(
    //     -textGeometry.boundingBox.max.x * 0.5, // Subtract bevel size
    //     -textGeometry.boundingBox.max.y * 0.5, // Subtract bevel size
    //     -textGeometry.boundingBox.max.z * 0.5 // Subtract bevel thickness
    //   )
    // }
  },
)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 2, 3)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

dbClkfullScreen(canvas)
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

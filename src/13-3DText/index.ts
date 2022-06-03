/* eslint-disable max-len */
import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, setFullScreen } from '../common/utils'

console.log('Haoyang Gao 20220602')

const defaultSceneColor = 0x512da8
const defaultTextInfo = "Joe G's world!"
const debugObj = {
  sceneColor: defaultSceneColor,
  text: defaultTextInfo,
  fullScreen: false,
  removeMesh() {},
  addMesh() {},
  showTextBounding: false,
}

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

/**
 * Debug
 */
const gui = new dat.GUI()

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x512da8)

// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad回调
  (font) => {
    const textureLoader = new THREE.TextureLoader()
    const matcapTexture = textureLoader.load('../assets/textures/matcaps/9.png')

    const material = new THREE.MeshMatcapMaterial()
    material.matcap = matcapTexture
    // material.wireframe = false

    let text: THREE.Mesh<TextGeometry, THREE.MeshMatcapMaterial>
    const createText = (textInfo = defaultTextInfo) => {
      const textGeometry = new TextGeometry(textInfo, {
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
      textGeometry.center()
      text = new THREE.Mesh(textGeometry, material)
      scene.add(text)
    }

    createText()

    // const boxHelper = new THREE.BoxHelper(text, 0xffff00)
    // boxHelper.visible = false
    // scene.add(boxHelper)

    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    const boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6)

    let meshArr: THREE.Mesh<THREE.BoxGeometry | THREE.TorusGeometry, THREE.MeshMatcapMaterial>[] = []
    const createMesh = () => {
      let mesh
      for (let i = 0; i < 100; i += 1) {
        if (i % 10 <= 1) {
          mesh = new THREE.Mesh(boxGeometry, material)
        } else {
          mesh = new THREE.Mesh(donutGeometry, material)
        }
        mesh.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        )
        mesh.setRotationFromEuler(
          new THREE.Euler(Math.PI * Math.random(), Math.PI * Math.random(), Math.PI * Math.random()),
        )
        const radomScale = Math.random() * 0.5 + 0.5
        mesh.scale.set(radomScale, radomScale, radomScale)
        meshArr.push(mesh)
      }
      scene.add(...meshArr)
    }

    const removeMesh = () => {
      scene.remove(...meshArr)
      meshArr = []
    }

    createMesh()

    gui.add(debugObj, 'text').onChange((e: string) => {
      // console.log(e)
      scene.remove(text)
      createText(e)
    })

    gui.addColor(debugObj, 'sceneColor').onChange((e: number) => {
      scene.background = new THREE.Color(e)
    })

    debugObj.addMesh = () => {
      createMesh()
    }
    gui.add(debugObj, 'addMesh')
    debugObj.removeMesh = () => {
      removeMesh()
    }
    gui.add(debugObj, 'removeMesh')
    gui.add(debugObj, 'fullScreen').onChange(() => {
      setFullScreen(document.body)
    })
  },
)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 3)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.4

gui.add(controls, 'autoRotate')
gui.add(controls, 'autoRotateSpeed').min(0.1).max(20).step(0.001)

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

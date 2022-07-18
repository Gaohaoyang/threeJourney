/* eslint-disable no-param-reassign */
import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Gui
const gui = new dat.GUI()

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 4, 15)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.3

/**
 * Objects
 */
// material
const material = new THREE.MeshStandardMaterial()

// sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material)
sphere.position.setY(1)
sphere.castShadow = true
scene.add(sphere)

// plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material)
plane.rotateX(-Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight()
directionLight.castShadow = true
directionLight.position.set(5, 5, 6)
const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.3)
scene.add(ambientLight, directionLight)

const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 2)
directionLightHelper.visible = false
scene.add(directionLightHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  // antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

/**
 * Physics
 */
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1,
  restitution: 0.7,
})
world.addContactMaterial(defaultContactMaterial)

const sphereShape = new CANNON.Sphere(1)
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 4, 0),
  shape: sphereShape,
  material: defaultMaterial,
})
world.addBody(sphereBody)

const guiObj = {
  drop() {
    sphereBody.position = new CANNON.Vec3(0, 4, 0)
  },
  CannonDebugger: false,
}

// floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: floorShape,
  material: defaultMaterial,
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)

// cannonDebugger
const cannonMeshes: THREE.Mesh[] = []
const cannonDebugger = CannonDebugger(scene, world, {
  onInit(body, mesh) {
    mesh.visible = false
    cannonMeshes.push(mesh)
  },
})
gui.add(guiObj, 'CannonDebugger').name('CannonDebugger mesh visible').onChange((value: boolean) => {
  if (value) {
    cannonMeshes.forEach((item) => {
      item.visible = true
    })
  } else {
    cannonMeshes.forEach((item) => {
      item.visible = false
    })
  }
})

// Animations
const tick = () => {
  stats.begin()
  controls.update()
  world.fixedStep()
  cannonDebugger.update() // Update the CannonDebugger meshes

  // @ts-ignore
  sphere.position.copy(sphereBody.position)
  // @ts-ignore
  sphere.quaternion.copy(sphereBody.quaternion)

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.documentElement)

/**
 * Debug
 */

gui.add(controls, 'autoRotate')
gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
gui.add(material, 'wireframe')
gui.add(directionLightHelper, 'visible').name('directionLightHelper visible')

gui.add(guiObj, 'drop')

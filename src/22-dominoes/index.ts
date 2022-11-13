/* eslint-disable no-param-reassign */
import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'
// import Axes from './Axes'

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

// scene.add(new Axes())

// Camera
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 8, 80)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.3

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

/**
 * Objects
 */
// material
const material = new THREE.MeshStandardMaterial()

// sphere
// const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), material)
// sphere.position.setY(1)
// sphere.castShadow = true
// scene.add(sphere)

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
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

/**
 * Sounds
 */
const hitSound = new Audio('../assets/sounds/hit.mp3')
const playHitSound = (collision: { contact: CANNON.ContactEquation }) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  if (impactStrength > 1.5) {
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

/**
 * Physics
 */
const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)

const floorMaterial = new CANNON.Material('floorMaterial')
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.01,
  restitution: 1,
})
const floorContactMaterial = new CANNON.ContactMaterial(floorMaterial, defaultMaterial, {
  friction: 0.9,
  restitution: 0.1,
})
// const slideContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
//   friction: 0.3,
//   restitution: 0.6,
// })
world.addContactMaterial(defaultContactMaterial)
world.addContactMaterial(floorContactMaterial)
// world.addContactMaterial(defaultContactMaterial)

// const sphereShape = new CANNON.Sphere(1)
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 4, 0),
//   shape: sphereShape,
//   material: defaultMaterial,
// })
// world.addBody(sphereBody)
// sphereBody.applyForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0, 0, 0))

const guiObj = {
  // drop() {
  //   sphereBody.position = new CANNON.Vec3(0, 4, 0)
  // },
  CannonDebugger: false,
}

// floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: floorShape,
  material: floorMaterial,
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)

const objectsToUpdate: Array<{
  mesh: THREE.Mesh
  body: CANNON.Body
}> = []
for (let i = 0; i < 20; i += 1) {
  const dominoe = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 3), material)
  dominoe.position.set(i * 4, 3, 0)
  dominoe.castShadow = true
  scene.add(dominoe)

  // Cannon body
  const shape = new CANNON.Box(new CANNON.Vec3(0.5 * 0.5, 6 * 0.5, 3 * 0.5))
  const body = new CANNON.Body({
    mass: 0.2,
    shape,
    material: defaultMaterial,
  })
  // @ts-ignore
  body.position.copy(dominoe.position)
  world.addBody(body)
  objectsToUpdate.push({
    mesh: dominoe,
    body,
  })
  body.addEventListener('collide', playHitSound)
}

// console.log(scene);
console.log(world)
// world.removeBody(world.bodies[1])
world.bodies[1].applyForce(new CANNON.Vec3(20, 0, 0), new CANNON.Vec3(0, 0, 0))

// cannonDebugger
const cannonMeshes: THREE.Mesh[] = []
const cannonDebugger = CannonDebugger(scene, world, {
  onInit(body, mesh) {
    mesh.visible = false
    cannonMeshes.push(mesh)
  },
})
gui
  .add(guiObj, 'CannonDebugger')
  .name('CannonDebugger mesh visible')
  .onChange((value: boolean) => {
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

  objectsToUpdate.forEach((object) => {
    // @ts-ignore
    object.mesh.position.copy(object.body.position)
    // @ts-ignore
    object.mesh.quaternion.copy(object.body.quaternion)
  })

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

// gui.add(guiObj, 'drop')

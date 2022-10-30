import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Playground from './Playground'
import Sizes from './utils/Sizes'

export default class Camera {
  playground: Playground

  sizes: Sizes

  scene: THREE.Scene

  canvas: HTMLCanvasElement

  instance: THREE.PerspectiveCamera

  controls: OrbitControls

  constructor() {
    this.playground = new Playground()
    this.sizes = this.playground.sizes
    this.scene = this.playground.scene
    this.canvas = this.playground.canvas

    this.setInstance()
    this.setControls()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
    this.instance.position.set(6, 4, 10)
    this.scene.add(this.instance)
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.target.set(0, 1, 0)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    this.controls.update()
  }
}

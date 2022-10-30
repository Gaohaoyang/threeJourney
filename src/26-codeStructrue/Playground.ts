import * as THREE from 'three'
import Sizes from './utils/Sizes'
import Time from './utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World'
import Resources from './utils/Resources'
import sources from './sources'

// eslint-disable-next-line no-use-before-define
let instance: Playground | null = null

export default class Playground {
  canvas: HTMLCanvasElement

  sizes: Sizes

  time: Time

  scene: THREE.Scene

  camera: Camera

  renderer: Renderer

  world: World

  resources: Resources

  constructor(canvas?: HTMLCanvasElement) {
    if (instance) {
      return instance
    }
    instance = this
    console.log('Playground')

    window.Playground = this

    if (canvas) {
      this.canvas = canvas
    }

    // setup
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    this.sizes.on('resize', () => {
      this.resize()
    })

    this.time.on('tick', () => {
      this.update()
    })

    this.scene.background = new THREE.Color('#666666')
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }

  update() {
    this.camera.update()
    this.renderer.update()
    this.world.update()
  }
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    Playground: Playground
  }
}

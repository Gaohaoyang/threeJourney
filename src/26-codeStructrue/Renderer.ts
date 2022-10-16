import * as THREE from 'three'
import Playground from './Playground'
import Camera from './Camera'
import Sizes from './utils/Sizes'

export default class Renderer {
  instance: THREE.WebGLRenderer

  canvas: HTMLCanvasElement

  playground: Playground

  sizes: Sizes

  scene: THREE.Scene

  camera: Camera

  constructor() {
    this.playground = new Playground()
    this.canvas = this.playground.canvas
    this.sizes = this.playground.sizes
    this.scene = this.playground.scene
    this.camera = this.playground.camera

    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.instance.physicallyCorrectLights = true
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}

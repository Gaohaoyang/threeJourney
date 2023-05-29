import * as THREE from 'three'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import EventEmitter from './EventEmitter'

interface SourceType {
  name: string
  type: string
  path: string | string[]
}

export default class Resources extends EventEmitter {
  private sources: SourceType[]

  private toLoad: number

  private loaded: number

  private loaders: {
    gltfLoader: GLTFLoader
    textureLoader: THREE.TextureLoader
    cubeTextureLoader: THREE.CubeTextureLoader
  }

  items: Record<string, THREE.CubeTexture | THREE.Texture | GLTF>

  constructor(sources: SourceType[]) {
    super()
    // Options
    this.sources = sources

    // Setup
    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }

  private setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    }
  }

  private startLoading() {
    // Load each source
    this.sources.forEach((source) => {
      switch (source.type) {
        case 'gltfModel':
          this.loaders.gltfLoader.load(source.path as string, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'texture':
          this.loaders.textureLoader.load(source.path as string, (file) => {
            this.sourceLoaded(source, file)
          })
          break
        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(source.path as string[], (file) => {
            this.sourceLoaded(source, file)
          })
          break
        default:
          break
      }
    })
  }

  private sourceLoaded(source: SourceType, file: THREE.CubeTexture | THREE.Texture | GLTF) {
    this.items[source.name] = file

    this.loaded += 1

    if (this.loaded === this.toLoad) {
      this.trigger('ready')
    }
  }
}

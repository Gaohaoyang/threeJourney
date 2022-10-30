import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import EventEmitter from './EventEmitter'

interface SourceType {
  name: string
  type: string
  path: string | string[]
}

export default class Resources extends EventEmitter {
  sources: SourceType[]

  items: Record<string, any>

  toLoad: number

  loaded: number

  loaders: {
    gltfLoader: GLTFLoader
    textureLoader: THREE.TextureLoader
    cubeTextureLoader: THREE.CubeTextureLoader
  }

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

  setLoaders() {
    this.loaders = {
      gltfLoader: new GLTFLoader(),
      textureLoader: new THREE.TextureLoader(),
      cubeTextureLoader: new THREE.CubeTextureLoader(),
    }
  }

  startLoading() {
    // Load each source
    this.sources.forEach((source) => {
      if (source.type === 'gltfModel') {
        this.loaders.gltfLoader.load(source.path as string, (file) => {
          this.sourceLoaded(source, file)
        })
      } else if (source.type === 'texture') {
        this.loaders.textureLoader.load(source.path as string, (file) => {
          this.sourceLoaded(source, file)
        })
      } else if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(source.path as string[], (file) => {
          this.sourceLoaded(source, file)
        })
      }
    })
  }

  sourceLoaded(source: SourceType, file: any) {
    this.items[source.name] = file

    this.loaded += 1

    if (this.loaded === this.toLoad) {
      this.trigger('ready')
    }
  }
}

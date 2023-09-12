import * as THREE from 'three'
import Resources from '../utils/Resources'
import Playground from '../Playground'

export default class Floor {
  private playground: Playground

  private scene: THREE.Scene

  private resources: Resources

  private geometry: THREE.CircleGeometry

  private textures: Record<string, THREE.Texture> = {}

  private material: THREE.MeshStandardMaterial

  private mesh: THREE.Mesh

  constructor() {
    this.playground = new Playground()
    this.scene = this.playground.scene
    this.resources = this.playground.resources
    // Setup
    this.setGeometry()
    this.setTextures()
    this.setMaterial()
    this.setMesh()
  }

  private setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64)
  }

  private setTextures() {
    this.textures.color = this.resources.items.floorColorTexture as THREE.Texture
    this.textures.color.encoding = THREE.sRGBEncoding
    this.textures.color.repeat.set(1.5, 1.5)
    this.textures.color.wrapS = THREE.RepeatWrapping
    this.textures.color.wrapT = THREE.RepeatWrapping

    this.textures.normal = this.resources.items.floorNormalTexture as THREE.Texture
    this.textures.normal.repeat.set(1.5, 1.5)
    this.textures.normal.wrapS = THREE.RepeatWrapping
    this.textures.normal.wrapT = THREE.RepeatWrapping
  }

  private setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    })
  }

  private setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}

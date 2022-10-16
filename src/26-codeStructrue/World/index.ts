import * as THREE from 'three'
import Playground from '../Playground'
import Environment from './Enviroment'
import Resources from '../utils/Resources'

export default class World {
  playground: Playground

  scene: THREE.Scene

  environment: Environment

  resources: Resources

  constructor() {
    this.playground = new Playground()
    this.scene = this.playground.scene
    this.resources = this.playground.resources

    // Test mesh
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial(),
    )
    this.scene.add(testMesh)

    this.resources.on('ready', () => {
      // Setup
      this.environment = new Environment()
    })
  }
}

import * as THREE from 'three'
import Playground from '../Playground'
import Environment from './Environment'
import Resources from '../utils/Resources'
import Floor from './Floor'
import Fox from './Fox'

export default class World {
  private playground: Playground

  private scene: THREE.Scene

  private environment: Environment

  private resources: Resources

  private floor: Floor

  private fox: Fox

  constructor() {
    this.playground = new Playground()
    this.scene = this.playground.scene
    this.resources = this.playground.resources

    // Test mesh
    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial(),
    // )
    // testMesh.position.set(0, 0.5, 0)
    // this.scene.add(testMesh)

    // Wait for resources to be ready
    this.resources.on('ready', () => {
      // Setup
      this.environment = new Environment()
      this.floor = new Floor()
      this.fox = new Fox()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}

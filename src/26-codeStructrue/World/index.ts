import * as THREE from 'three'
import Playground from '../Playground'
import Environment from './Enviroment'
import Resources from '../utils/Resources'
import Floor from './Floor'
import Fox from './Fox'

export default class World {
  playground: Playground

  scene: THREE.Scene

  environment: Environment

  resources: Resources

  floor: Floor

  fox: Fox

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

    this.resources.on('ready', () => {
      // Setup
      this.floor = new Floor()
      this.fox = new Fox()
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}

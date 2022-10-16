/* eslint-disable no-param-reassign */
import * as THREE from 'three'
import Playground from '../Playground'
import Resources from '../utils/Resources'

export default class Environment {
  playground: Playground

  scene: THREE.Scene

  sunLight: THREE.DirectionalLight

  environmentMap: Record<string, any>

  resources: Resources

  constructor() {
    this.playground = new Playground()
    this.scene = this.playground.scene
    this.resources = this.playground.resources

    // Setup
    this.setSunLight()
    this.setEnvironmentMap()
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3, 3, -2.25)
    this.scene.add(this.sunLight)
  }

  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.4
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.encoding = THREE.sRGBEncoding

    this.scene.environment = this.environmentMap.texture

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child: THREE.Mesh) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }
    this.environmentMap.updateMaterials()
  }
}

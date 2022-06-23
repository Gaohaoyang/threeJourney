粒子特效

听到粒子特效，是不是无比期待？可以用它实现非常多的效果如星空、烟雾、雨、灰尘、火等。

粒子特效的优势是即使使用了成百上千的例子，也能保证比较高的帧率。缺点是每个粒子都由一个始终面向相机的平面（两个三角形）组成。

创建粒子像创建几何体一样简单，我们使用 [PointsMaterial](https://threejs.org/docs/index.html#api/zh/materials/PointsMaterial) 材质，它不会创建几何体而是创建非常多的点 [Points](https://threejs.org/docs/index.html#api/zh/objects/Points)。下面我们开始吧。

# 第一个粒子效果

## Geometry 几何体

创建一个球体

```js
/**
 * Particles
 */
// geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
```

## PointsMaterial 点材质

创建点材质

```js
// material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
})
```

有2个属性

- `.size : Number`
  - 设置点的大小。默认值为1.0。
- `.sizeAttenuation : Boolean`
  - 指定点的大小是否因相机深度而衰减。（仅限透视摄像头。）默认为true。

## 使用 Points

之前我们都是使用 Mesh 网格几何体，现在使用点 Points。

```js
const particles = new THREE.Points(sphereGeometry, pointMaterial)
scene.add(particles)
```

效果如下

![](https://gw.alicdn.com/imgextra/i3/O1CN01EqsYdX22rk8imird0_!!6000000007174-2-tps-2090-922.png)

改变 sizeAttenuation 和 size 效果如下

![](https://gw.alicdn.com/imgextra/i2/O1CN01jsLVCA1rAjANG3ca5_!!6000000005591-1-tps-927-350.gif)

在线 [demo 链接](https://gaohaoyang.github.io/threeJourney/18-particles/)

可扫码访问

![](https://gw.alicdn.com/imgextra/i1/O1CN01mhQqxe1rbkXDnNDzF_!!6000000005650-2-tps-200-200.png)

[demo 源码](https://github.com/Gaohaoyang/threeJourney/tree/main/src/18-particles)

完整代码如下

```js
import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.metalness = 0
material.roughness = 0.4

/**
 * Particles
 */
// geometry
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)

// material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.02,
  sizeAttenuation: true,
})

const particles = new THREE.Points(sphereGeometry, pointMaterial)
scene.add(particles)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 1.8, 2)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.autoRotateSpeed = 0.2
controls.zoomSpeed = 0.3

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.body)

// Animations
const tick = () => {
  stats.begin()

  controls.update()
  pointMaterial.needsUpdate = true

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()

/**
 * Debug
 */
const gui = new dat.GUI()

gui.add(controls, 'autoRotate')
gui.add(controls, 'autoRotateSpeed', 0.1, 10, 0.01)
gui.add(pointMaterial, 'size', 0.01, 0.1, 0.001)
gui.add(pointMaterial, 'sizeAttenuation')
```

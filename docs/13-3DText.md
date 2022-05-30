本节将学习 3D Text，并做一个炫酷的 3D Text 展示页面。我们将使用 [TextGeometry](https://threejs.org/docs/#examples/zh/geometries/TextGeometry) 文本缓冲几何体来实现。

# typeface font

Three.js 内置了 [FontLoader](https://threejs.org/docs/#examples/zh/loaders/FontLoader) 来加载 json 格式字体。可以使用 [facetype.js](http://gero3.github.io/facetype.js/) 在线转换 json 字体。

![](https://gw.alicdn.com/imgextra/i3/O1CN016uvJVz1aMm75D04iV_!!6000000003316-2-tps-1786-1226.png)


# Load the font

```js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
...
// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad回调
  (font) => {
    console.log('loaded', font)
  },
)
```

![](https://gw.alicdn.com/imgextra/i3/O1CN01rCmHeR1uKkg3Q7pMr_!!6000000006019-2-tps-948-304.png)

加载成功。接下来我们需要在成功回调里继续完成代码

# Create TextGeometry

```js
// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad回调
  (font) => {
    console.log('loaded', font)
    const textGeometry = new TextGeometry("Joe CS's three.js world!", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    })

    const textMaterial = new THREE.MeshBasicMaterial()
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)
  },
)
```

![](https://gw.alicdn.com/imgextra/i3/O1CN01biVOtn29Rp1n3h48P_!!6000000008065-2-tps-1135-545.png)

可以看到文字并没有在中间位置，我们需要居中展示

## Center the text

居中的方式是计算几何体的立方体边界，再进行位移。

使用 BoxHelper 可以观察 bounding box

```js
const box = new THREE.BoxHelper(text, 0xffff00)
scene.add(box)
```

![](https://gw.alicdn.com/imgextra/i3/O1CN013nOpwF21AP2YBRYLA_!!6000000006944-2-tps-1136-548.png)

于是我们使用 `computeBoundingBox` 获取 box 的尺寸，再进行位移，代码如下

```js
textGeometry.computeBoundingBox() // 计算 box 边界
if (textGeometry.boundingBox) {
  textGeometry.translate(
    -textGeometry.boundingBox.max.x * 0.5, // Subtract bevel size
    -textGeometry.boundingBox.max.y * 0.5, // Subtract bevel size
    -textGeometry.boundingBox.max.z * 0.5, // Subtract bevel thickness
  )
}
```

可以看到完成了居中展示

![](https://gw.alicdn.com/imgextra/i1/O1CN01TPMEqk29MmfsMFA5z_!!6000000008054-2-tps-1120-522.png)

当然还可以直接使用

```js
textGeometry.center()
```

完整代码如下

```js
import * as THREE from 'three'
import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Load font
const fontLoader = new FontLoader()
fontLoader.load(
  '../assets/fonts/Fira Code Medium_Regular.json',
  // onLoad回调
  (font) => {
    console.log('loaded', font)
    const textGeometry = new TextGeometry("Joe CS's world!", {
      font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    })

    const textMaterial = new THREE.MeshBasicMaterial()
    textMaterial.wireframe = true

    textGeometry.center() // 居中

    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    const box = new THREE.BoxHelper(text, 0xffff00)
    scene.add(box)
  },
)

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 2, 3)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

dbClkfullScreen(canvas)
listenResize(sizes, camera, renderer)

// Animations
const tick = () => {
  stats.begin()

  controls.update()
  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
```

![](https://gw.alicdn.com/imgextra/i3/O1CN010Gstck1gOxhLBcgWc_!!6000000004133-2-tps-1127-545.png)

# Add a matcap material



# Add objects

# Optimize

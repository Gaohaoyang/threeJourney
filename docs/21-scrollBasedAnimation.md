Scroll based animation 基于页面滚动的动画

本节我们将学习基于页面滚动的动画。很好的将之前所学的内容做一个复习和运用。

我们会把 WebGL 部分固定到页面中，随着页面的滚动 WebGL 中也随之相应的产生动画效果。这种联动的效果会带来非常好的体验，并且也会让你的页面看起来很高级很有未来感。联动的效果主要是使用 camera 的角度变化来实现。并且最后会加入一些滚动到某个区域后的动画效果。

# 准备

因为我们使用固定视角的相机，所以 `OrbitControls` 就不再需要了。我们需要设置一些 HTML 内容，并且撑满屏幕高度

HTML 结构如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>scroll based animation</title>
  </head>

  <body>
    <canvas id="mainCanvas" class="webgl"></canvas>
    <section class="section">
      <h1>Hello</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
    <script src="<%= path %>" charset="utf-8"></script>
  </body>
</html>

```

CSS 代码如下，我们设置了页面背景色，设置 `section` 高度为 `100vh`，设置好布局

```css
body {
  margin: 0;
  padding: 0;
  background-color: #263238;
}

.webgl {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}

.section {
  padding-left: 10%;
  padding-right: 10%;
  display: flex;
  align-items: center;
  height: 100vh;
  font-size: 7vmin;
  position: relative;
  color: #fff;
}

section:nth-child(odd) {
  justify-content: flex-end;
}
```

一个可以滚动的页面就完成了

我们在 ts 文件中再绘制一个基础的小立方体和灯光

```js
import * as THREE from 'three'
import './style.css'
import * as dat from 'lil-gui'
import stats from '../common/stats'
import { listenResize, dbClkfullScreen } from '../common/utils'

// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)

/**
 * Objects
 */
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial())
scene.add(cube)

const directionLight = new THREE.DirectionalLight()
directionLight.position.set(1.5, 1, 1)
const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0.2)
scene.add(ambientLight, directionLight)

const directionLightHelper = new THREE.DirectionalLightHelper(directionLight, 2)
scene.add(directionLightHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

listenResize(sizes, camera, renderer)
dbClkfullScreen(document.documentElement)

// Animations
const tick = () => {
  stats.begin()
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
gui.add(directionLightHelper, 'visible').name('directionLightHelper visible')
```

效果如下

![](https://gw.alicdn.com/imgextra/i2/O1CN01bJcItJ1Y2xksDRCuZ_!!6000000003002-1-tps-721-439.gif)

# 物体

## 几何体

我们将原有的立方体移除，使用 Three.js 内置的 圆环 TorusGeometry、圆锥 ConeGeometry 和圆环扭结 TorusKnotGeometry

```js
// Meshes
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)
const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' }),
)

scene.add(mesh1, mesh2, mesh3)
```

效果如下

![](https://gw.alicdn.com/imgextra/i2/O1CN01b50dQd1nKZDTxcgUo_!!6000000005071-2-tps-1133-595.png)

别着急，随后我们修改几何体的为位置和相机视角

接下来我们设置材质

## 材质

我们使用卡通材质

```js
// Material
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor })

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

scene.add(mesh1, mesh2, mesh3)
```

![](https://gw.alicdn.com/imgextra/i3/O1CN01lq6de21e1UAaBaXhj_!!6000000003811-2-tps-1130-584.png)

## 灯光

我们把刚刚移除的灯光重新加回来

```js
/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
```

现在效果好多了

![](https://gw.alicdn.com/imgextra/i3/O1CN01TxEhQk1Y7XiOLqqNU_!!6000000003012-2-tps-1133-591.png)

```js
const gui = new dat.GUI()
gui.addColor(parameters, 'materialColor').onChange(() => {
  material.color.set(parameters.materialColor)
})
```

增加 gui 就可以在右上角调节颜色了

## Gradient texture 渐变纹理

```js
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('https://gw.alicdn.com/imgextra/i1/O1CN01Kv3xWT1kImpSDZI8n_!!6000000004661-0-tps-5-1.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
})
```

这个 gradientMap 图片为5个像素点灰阶图片。如下图

![](https://gw.alicdn.com/imgextra/i1/O1CN01Kv3xWT1kImpSDZI8n_!!6000000004661-0-tps-5-1.jpg)

这里注意 `magFilter` 的使用，如果遗忘了复习 [Three.js 之 6 Texture 纹理](https://gaohaoyang.github.io/2022/05/23/three-textures/#minification-filter-%E7%BC%A9%E5%B0%8F%E6%BB%A4%E9%95%9C)。

![](https://gw.alicdn.com/imgextra/i4/O1CN01xfd2sR1WS2CktnMa1_!!6000000002786-2-tps-1132-590.png)

## 位置

Three.js 默认是根据竖直方向的高度定相机视野适配的，高度等比适配

例如我设置如下代码

```js

mesh1.position.y = 4
mesh1.scale.set(0.5, 0.5, 0.5)

mesh2.visible = false

mesh3.position.y = -4
mesh3.scale.set(0.5, 0.5, 0.5)
```

不管怎么移动窗口，可以看到2个物体距顶部和底部的距离比例不变。如下图

![](https://gw.alicdn.com/imgextra/i4/O1CN01xWiNBI1XcrBCejzC4_!!6000000002945-1-tps-935-783.gif)

我们移除刚才的测试代码

声明一个物体距离

```js
const objectsDistance = 4
```

并设置在每个物体上

```js
mesh1.position.y = -objectsDistance * 0
mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2
```

![](https://gw.alicdn.com/imgextra/i3/O1CN01BdLY191mQgtfo6Eq3_!!6000000004949-2-tps-1132-647.png)

现在我们只能看到第一个物体

## 增加一些物体的自转

将几何体放入数组

```js
const sectionMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshToonMaterial>[] = [
  mesh1,
  mesh2,
  mesh3,
]
```

再一起加入动画

```js
// Animations
const clock = new THREE.Clock()
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  // Animate meshes
  sectionMeshes.forEach((mesh) => {
    mesh.rotation.set(elapsedTime * 0.1, elapsedTime * 0.12, 0)
  })

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}
```

效果如下

![](https://gw.alicdn.com/imgextra/i2/O1CN01AqBktg1wRHZ7wF1XP_!!6000000006304-1-tps-1129-629.gif)

# 相机与滚动

接下来我们要添加随着页面滚动相机也进行位置变化的效果

首先我们要监听页面的滚动

```js
/**
 * Scroll
 */
let { scrollY } = window
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  console.log(scrollY)
})
```

可以看到 log 里已经有了滚动距离

接下来在 requestAnimationFrame 中控制对相机的移动，这里需要注意的是相机的位置移动比例

```js
// Animations
const tick = () => {
  // ...

  // animate camera
  camera.position.setY((-scrollY / sizes.height) * objectsDistance)

  // ...
}
```

HTML 页面滚动距离与相机需要位移的距离相反，因此要添加负号。`-scrollY / sizes.height` 表示设置相机移动的每个区域为了 1 个单位。但几何体实际位置是 `objectsDistance` 单位距离，所以最终为 `-scrollY / sizes.height) * objectsDistance`。

效果如下

![](https://gw.alicdn.com/imgextra/i2/O1CN01yS3kMU1MJenryWWjj_!!6000000001414-1-tps-1129-629.gif)

## 几何体水平位置修改

我们将几何体水平位置稍做移动，以适配文字，并将之前对 y 值设置的代码也可以放在这个 for 循环里

```js
sectionMeshes.forEach((item, index) => {
  item.position.setY(-objectsDistance * index)
  item.position.setX(index % 2 === 0 ? 2 : -2)
})
```

![](https://gw.alicdn.com/imgextra/i1/O1CN018Wv7QZ1BsVA3wqxXj_!!6000000000001-1-tps-1129-629.gif)

## 视差效果

我们再增加一点视差效果，当鼠标移动时，几何体的位置稍微进行一点点偏移，更有沉浸感。

我们沿用上一节学到的监听鼠标移动

```js
/**
 * Mouse
 */
const mouse: {
  x: number | null
  y: number | null
} = { x: null, y: null }

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})
```

我们不能直接在 requestAnimationFrame 再修改 camera 的位置，因为之前已经设置过了滚动时相机的位移，我们不能覆盖这个位移，所以可以用一个取巧的方式，给相机增加一个 group，移动 group 达到再增加一个位移的效果

```js
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 4)
cameraGroup.add(camera)
```

```js
// Animations
const tick = () => {
  // ...

  if (mouse.x && mouse.y) {
    cameraGroup.position.setX(mouse.x)
    cameraGroup.position.setY(mouse.y)
  }

  // ...
}
```

效果如下

![](https://gw.alicdn.com/imgextra/i3/O1CN01WJTCOu1DGbcigCPOS_!!6000000000189-1-tps-1129-629.gif)

## 缓动效果

视察效果看起来不过，但是我们想让它表现更好，可以增加一些缓动效果，更符合弹性阻尼物理效果。

这里通过 deltaTime 来进行增量位移。需要特别注意的是不能在同一个 `requestAnimationFrame` 里同时使用 getElapsedTime 和 getDelta。因为 getElapsedTime 里也调用了 getDelta，这是一个危险的设计。详情见 issue [THREE.clock.getElapsedTime has a side effect invalidating .getDelta() #5696](https://github.com/mrdoob/three.js/issues/5696)

所以我们要自己计算 deltaTime 代码如下

```js
// Animations
const clock = new THREE.Clock()
let previousTime = 0
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime
  // const deltaTime2 = clock.getDelta()
  // console.log(deltaTime);
  // console.log(deltaTime2);
  // console.log('----');

  // Animate meshes
  sectionMeshes.forEach((mesh) => {
    mesh.rotation.set(elapsedTime * 0.1, elapsedTime * 0.12, 0)
  })

  // animate camera
  camera.position.setY((-scrollY / sizes.height) * objectsDistance)

  if (mouse.x && mouse.y) {
    const parallaxX = mouse.x * 0.5
    const parallaxY = mouse.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
  }

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}
```

![](https://gw.alicdn.com/imgextra/i4/O1CN01HfsTp01UdpAUYkk3T_!!6000000002541-1-tps-1129-629.gif)

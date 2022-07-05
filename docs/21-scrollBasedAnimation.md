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

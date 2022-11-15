Three.js 和 Cannon-es 实现多米诺骨牌效果

# 什么是 Three.js

Three.js是一个跨浏览器的脚本，使用JavaScript函数库或API来在网页浏览器中创建和展示动画的三维计算机图形。Three.js 使用 WebGL。源代码托管在GitHub。

![](https://gw.alicdn.com/imgextra/i3/O1CN01sDl09n1GfkEidl2Q6_!!6000000000650-2-tps-316-159.png)

类似的还有 Babylon.js （微软旗下）

![](https://gw.alicdn.com/imgextra/i3/O1CN01WQrCTJ1VEvHN89rfp_!!6000000002622-2-tps-409-123.png)

# 什么是 Cannon-es

物理引擎。

Three.js 创建了一个 3d 世界，我们再通过物理引擎创建一个物理世界，在物理世界中存在着纯物理体系（牛顿力学、万有引力、胡克弹性定律等），然后将物理世界中的几何体运动每帧坐标映射到 Three.js 3d 世界中，就可以进行实现物理效果的运动了。

# Three.js 基础场景简介

- 场景
- 相机
- 物体
- 光影
- 动画
- 渲染器

## 场景、地面、环境光与相机创建

场景

```js
// Scene
const scene = new THREE.Scene()
```

渲染场景

```js
// Canvas
const canvas = document.querySelector('#mainCanvas') as HTMLCanvasElement

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```

添加地面

```js
// material
const materialPlane = new THREE.MeshStandardMaterial({
  metalness: 0.4,
  roughness: 0.5,
  color: '#E8F5E9',
})

// plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(150, 150), materialPlane)
plane.rotateX(-Math.PI / 2)

scene.add(plane)
```

添加相机

```js
const camera = new THREE.PerspectiveCamera(20, sizes.width / sizes.height, 0.1, 10000)
camera.position.set(5, 50, 150)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.3
controls.target.set(5, 10, 0)
```

添加环境光

```js
const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 3)
scene.add(ambientLight)
```

![](https://gw.alicdn.com/imgextra/i2/O1CN018UPBgR1SwwUxDFZXQ_!!6000000002312-2-tps-1132-597.png)

## 添加多米诺骨牌

```js
const dominoeDepth = 0.2
const dominoeHeight = 3
const dominoeWidth = 1.5

const addOneDominoe = (
  x: number,
  y: number,
  z: number,
  color: {
    r: number
    g: number
    b: number
  } = {
    r: 255,
    g: 255,
    b: 255,
  }
) => {
  const geometry = new THREE.BoxGeometry(dominoeDepth, dominoeHeight, dominoeWidth)

  const material = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.8,
    color: new THREE.Color(`rgb(${color.r}, ${color.g}, ${color.b})`),
  })
  const dominoe = new THREE.Mesh(geometry, material)
  dominoe.position.set(x, y, z)

  scene.add(dominoe)
}
```

![](https://gw.alicdn.com/imgextra/i2/O1CN01hm6OIU1jhENd4RFGc_!!6000000004579-2-tps-926-426.png)

看到此刻并不是白色，这是因为光的亮度不够。我们添加一些平行光。

## 添加平行光与投影

```js
/**
 * Light
 */
const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.castShadow = true
directionLight.shadow.camera.top = 50
directionLight.shadow.camera.right = 50
directionLight.shadow.camera.bottom = -50
directionLight.shadow.camera.left = -50
directionLight.shadow.camera.near = 1
directionLight.shadow.camera.far = 200
directionLight.shadow.mapSize.set(2048, 2048)
const directionalLightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

directionLight.position.set(-50, 80, 60)
scene.add(directionLight)
```

渲染器开启投影

```js
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
```

地面接受投影

```js
plane.receiveShadow = true
```

骨牌产生投影并接受投影

```js
dominoe.castShadow = true
dominoe.receiveShadow = true
```

![](https://gw.alicdn.com/imgextra/i2/O1CN01eDFfdW1PROMiDTU3S_!!6000000001837-2-tps-875-428.png)

已经接近成功了，只需要多摆几个骨牌就好了。

## 骨牌位置算法

### 起点位置

先绘制开始的一条线和三角形扩散的部分

```js
const addTriangle = () => {
  for (let row = 0; row < 9; row += 1) {
    for (let i = 0; i <= row; i += 1) {
      addOneDominoe(
        (-dominoeHeight / 2) * (9 - row),
        dominoeHeight / 2,
        1.5 * dominoeWidth * i + dominoeWidth * 0.8 * (9 - row)
      )
    }
  }

  // start line
  for (let i = 0; i < 10; i += 1) {
    addOneDominoe(
      (-dominoeHeight / 2) * 10 - (i * dominoeHeight) / 2,
      dominoeHeight / 2,
      dominoeWidth * 0.8 * 9
    )
  }
}
```

![](https://gw.alicdn.com/imgextra/i3/O1CN01F4ArXR1CfVZOM6QyC_!!6000000000108-2-tps-961-441.png)

### 图案位置

图案考虑使用一个 20*10 的矩阵。类似如下

![](https://gw.alicdn.com/imgextra/i1/O1CN0143tCD41Txgl8YAaue_!!6000000002449-2-tps-1500-784.png)

使用 canvas2d 的 getImageData 获取每个像素的颜色

```js
const getMinifyPicColor = () => new Promise((resolve) => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#picCanvas')
  const minify2DArr: Array<{
    r: number
    g: number
    b: number
  }> = []
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const img = new Image()
      img.src = '../assets/Hello.png'
      img.addEventListener('load', () => {
        ctx.drawImage(img, 0, 0, 20, 10, 0, 0, 20, 10)

        const imageData = ctx.getImageData(0, 0, 20, 10)
        const pixels = imageData.data

        for (let i = 0; i < pixels.length; i += 4) {
          minify2DArr.push({
            r: pixels[i],
            g: pixels[i + 1],
            b: pixels[i + 2],
          })
        }
        ctx.putImageData(imageData, 0, 0)
        const newArr = []
        while (minify2DArr.length) newArr.push(minify2DArr.splice(0, 20))
        resolve(newArr)
      })
    }
  }
})
```

返回一个二维数组

![](https://gw.alicdn.com/imgextra/i2/O1CN01gPZJ6w1b4kAjawAoZ_!!6000000003412-2-tps-1112-362.png)

遍历渲染这个二维数组

```js
getMinifyPicColor().then((arr) => {
  arr.forEach((item, index) => {
    item.forEach((color, i) => {
      addOneDominoe((i * dominoeHeight) / 2, dominoeHeight / 2, 1.5 * dominoeWidth * index, color)
    })
  })
})
```

![](https://gw.alicdn.com/imgextra/i4/O1CN01oV1Rtm1IewmIwMqyD_!!6000000000919-2-tps-912-409.png)

## 添加物理引擎

初始化物理引擎，设置材质与摩擦力

```js
/**
 * Physics
 */
const world = new CANNON.World()
world.gravity.set(0, -10, 0) // 重力加速度
world.allowSleep = true

const floorMaterial = new CANNON.Material('floorMaterial') // 地面
const defaultMaterial = new CANNON.Material('default') // 骨牌
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.01,
  restitution: 0.3,
})
const floorContactMaterial = new CANNON.ContactMaterial(floorMaterial, defaultMaterial, {
  friction: 0.9,
  restitution: 0.6,
})
world.addContactMaterial(defaultContactMaterial)
world.addContactMaterial(floorContactMaterial)
```

设置地面物理模型

```js
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: floorShape,
  material: floorMaterial,
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)
```

设置骨牌物理模型

```js
  const shape = new CANNON.Box(
    new CANNON.Vec3(dominoeDepth * 0.5, dominoeHeight * 0.5, dominoeWidth * 0.5)
  )
  const body = new CANNON.Body({
    mass: 0.2,
    shape,
    material: defaultMaterial,
  })
  // @ts-ignore
  body.position.copy(dominoe.position)
  body.sleepSpeedLimit = 1
  world.addBody(body)
```

最后将物理世界与几何世界进行每帧联动

```js
// Animations
const tick = () => {
  stats.begin()
  controls.update()
  world.fixedStep()
  cannonDebugger.update() // Update the CannonDebugger meshes

  objectsToUpdate.forEach((object) => {
    // @ts-ignore
    object.mesh.position.copy(object.body.position) // 位置
    // @ts-ignore
    object.mesh.quaternion.copy(object.body.quaternion) // 四元数
  })

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
```

可以通过 debug 观察物理模型线框

![](https://gw.alicdn.com/imgextra/i2/O1CN010MglHO1xZoaLkJHXX_!!6000000006458-2-tps-1129-597.png)

## 启动第一块骨牌

施加一个力

```js
guiObj.start = () => {
  world.bodies[world.bodies.length - 1].applyForce(
    new CANNON.Vec3(30, 0, 0),
    new CANNON.Vec3(0, 0, 0)
  )
}
```

![](https://gw.alicdn.com/imgextra/i4/O1CN01AakRmV1Wd1jnb2tDz_!!6000000002810-1-tps-480-278.gif)

# 小结

碰撞过程还可以添加一些音效，丰富体验。

了解了 3d 渲染引擎 和 物理引擎的使用。

看起复杂的东西，其实大部分都已经有了现成的封装，如果仅仅是使用，并不会那么复杂，我们都是站在巨人的肩膀上的。

demo 链接 https://gaohaoyang.github.io/threeJourney/22-dominoes/

demo 源码 https://github.com/Gaohaoyang/threeJourney/tree/main/src/22-dominoes

光线投射 Raycaster

光线投射可以发射一个特定方向的射线，来检测是否有物体与这个射线相交。有以下的使用场景：

- 检测玩家前方是否有墙
- 检测射击游戏是否击中了什么物体
- 检测是否有什么物体在鼠标下，并模拟鼠标事件
- 等

# 创建光线投射 Raycaster

我们沿着 x 轴，创建 3 个球体，从最左边发射一个射线，沿着 x 轴指向右侧

```js
/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#B71C1C' })
)
object1.position.setX(-4)
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#B71C1C' })
)
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: '#B71C1C' })
)
object3.position.setX(4)

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
const rayOrigin = new THREE.Vector3(-6, 0, 0)
const rayDirections = new THREE.Vector3(10, 0, 0)
rayDirections.normalize()
raycaster.set(rayOrigin, rayDirections)
```

[Raycaster 类](https://threejs.org/docs/index.html?q=Raycaster#api/zh/core/Raycaster)

`Raycaster( origin : Vector3, direction : Vector3, near : Float, far : Float )`

- origin —— 光线投射的原点向量。
- direction —— 向射线提供方向的方向向量，应当被标准化。
- near —— 返回的所有结果比near远。near不能为负值，其默认值为0。
- far —— 返回的所有结果都比far近。far不能小于near，其默认值为Infinity（正无穷。）

set 方法##

`.set ( origin : Vector3, direction : Vector3 ) : undefined`

- origin —— 光线投射的原点向量。
- direction —— 为光线提供方向的标准化方向向量。

为了便于观察这个射线，我们使用 arrowHelper 可视化这个射线

```js
const arrowHelper = new THREE.ArrowHelper(
  raycaster.ray.direction,
  raycaster.ray.origin,
  15,
  0xff0000,
  1,
  0.5,
)
scene.add(arrowHelper)
```

效果如下

![](https://gw.alicdn.com/imgextra/i3/O1CN01srmtNL21874749vmU_!!6000000006939-2-tps-1134-542.png)

## 相交检测

`.intersectObject ( object : Object3D, recursive : Boolean, optionalTarget : Array ) : Array`

- distance —— 射线投射原点和相交部分之间的距离。
- point —— 相交部分的点（世界坐标）
- face —— 相交的面
- faceIndex —— 相交的面的索引
- object —— 相交的物体
- uv —— 相交部分的点的UV坐标。
- uv2 —— Second set of U,V coordinates at point of intersection
- instanceId – The index number of the instance where the ray intersects the InstancedMesh

检测一组物体

`.intersectObjects ( objects : Array, recursive : Boolean, optionalTarget : Array ) : Array`

我们加入以下代码

```js
const intersect = raycaster.intersectObject(object1)
const intersects = raycaster.intersectObjects([object1, object2, object3])

console.log(intersect)
console.log(intersects)
```

可以看到日志

![](https://gw.alicdn.com/imgextra/i4/O1CN01Nmrb4i1kpIwhMuFHx_!!6000000004732-2-tps-1088-745.png)

## 动态检测

我们让3个球运动起来，动态检测是否被射线穿过

首先给3个小球的 positionY 设置位移

```js
// Animations
const clock = new THREE.Clock()
const tick = () => {
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  object1.position.setY(Math.sin(elapsedTime * 2) * 2)
  object2.position.setY(Math.sin(elapsedTime * 1.5) * 2)
  object3.position.setY(Math.sin(elapsedTime * 3) * 2)

  controls.update()

  // Render
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(tick)
}

tick()
```

效果如下

![](https://gw.alicdn.com/imgextra/i4/O1CN01DDpapq1T1WQfC6xID_!!6000000002322-1-tps-348-212.gif)

增加 `intersectObjects` 相交检测，并设置相交后的颜色。这里我们遍历所有的物体为其上色

```js
const tick = () => {

  ...

  const objectsToTest = [object1, object2, object3]
  const intersects = raycaster.intersectObjects(objectsToTest)

  objectsToTest.forEach((item) => {
    item.material.color.set('#B71C1C')
  })

  intersects.forEach((item) => {
    item.object.material.color.set('#F9A825')
  })
  requestAnimationFrame(tick)
}
tick()
```

![](https://gw.alicdn.com/imgextra/i1/O1CN011DDy2n1ibRjJr7abI_!!6000000004431-1-tps-349-311.gif)

在线 [demo 链接](https://gaohaoyang.github.io/threeJourney/20-raycaster/)

可扫码访问

![](https://gw.alicdn.com/imgextra/i1/O1CN016BK6t21Ea87dIN4Ud_!!6000000000367-2-tps-200-200.png)

[demo 源码](https://github.com/Gaohaoyang/threeJourney/tree/main/src/20-raycaster)

# 使用鼠标光线投射

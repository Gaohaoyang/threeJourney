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

set 方法

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

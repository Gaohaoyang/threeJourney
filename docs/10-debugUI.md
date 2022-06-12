本系列为 [Three.js journey](https://threejs-journey.com/) 教程学习笔记。包含以下内容

- [Three.js 之 1 Animation 动画](https://juejin.cn/post/7095621578976657421)
- [Three.js 之 2 Camera 相机](https://juejin.cn/post/7101207231382683655)
- [Three.js 之 3 画布与全屏](https://juejin.cn/post/7101207945387442212)
- [Three.js 之 4 Geometry 几何体](https://juejin.cn/post/7101208474775715876)
- [Three.js 之 5 debug UI](https://juejin.cn/post/7101209060753539109)
- [Three.js 之 6 Texture 纹理](https://juejin.cn/post/7101209181822124069)
- [Three.js 之 7 Materials 材质](https://juejin.cn/post/7103191619373006885/)
- [Three.js 之 8 炫酷的 3D Text](https://juejin.cn/post/7104817223444725774)
- [Three.js 之 9 Light 光](https://juejin.cn/post/7107886009253101599/)
- [Three.js 之 10 Shadow 投影](https://juejin.cn/post/7108379667387645982)

未完待续

本节将学习 debug UI。用于实时方便调整动画或物体的各种参数。我们可以自己开发，也可以使用一个三方库，这里我们选择使用现成的库。常见的库有

- dat.GUI
- control-panel
- ControlKit
- Guify
- Oui

# dat.GUI

我们将学习 [dat.GUI](https://github.com/dataarts/dat.gui)，这个 debugUI 的 api 也非常简单可以直接参考 [api文档](https://github.com/dataarts/dat.gui/blob/master/API.md)

我们添加如下代码

```js
/**
 * Debug
 */
const gui = new dat.GUI({
  // closed: true,
  width: 400,
})
// gui.hide() // press H to show

gui.add(cubeMesh.position, 'y').min(-3).max(3).step(0.01)
  .name('cubeMesh Y') // 别名
gui.add(cubeMesh.position, 'x').min(-3).max(3).step(0.01)
gui.add(cubeMesh.position, 'z').min(-3).max(3).step(0.01)

gui.add(cubeMesh, 'visible') // boolean
gui.add(cubeMesh.material, 'wireframe') // boolean

const debugObj = {
  color: defaultColor,
  spin() {
    gsap.to(cubeMesh.rotation, {
      duration: 1,
      y: cubeMesh.rotation.y + Math.PI * 2,
    })
  },
}

gui.addColor(debugObj, 'color').onChange((e) => {
  cubeMesh.material.color.set(e)
})

gui.add(debugObj, 'spin') // function
```

效果如下

![](https://gw.alicdn.com/imgextra/i4/O1CN014PYQlU1eZprccV5TV_!!6000000003886-2-tps-410-224.png)

动态演示

![](https://gw.alicdn.com/imgextra/i2/O1CN01ITDxTh1rEqit3lgtY_!!6000000005600-1-tps-1131-581.gif)

完整代码和 demo 如下

在线 [demo 链接](https://gaohaoyang.github.io/threeJourney/10-debugUI/)

[demo 源码](https://github.com/Gaohaoyang/threeJourney/tree/main/src/10-debugUI)

# 小结

项目开发的过程中就可以添加 debug UI，开发过程可以不断调整，找到最佳值。


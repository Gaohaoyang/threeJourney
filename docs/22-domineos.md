Three.js 和 Cannon-es 实现多米诺骨牌效果

https://gaohaoyang.github.io/threeJourney/22-dominoes/

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

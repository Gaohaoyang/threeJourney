使用 Blender 设计模型

有很多 3D 建模的软件，比如 Cinema 4D、Maya、3DS Max、Blender、ZBrush 等。本节课我们将学习 Blender 因为它是免费的，并且性能也还不错。

本节课学习完成后，你并不会成为 Blender 的专家，因为它需要更多完整的课程才能熟练。我们只是学习的软件的入门，以便能够应对更多地简单模型。熟悉一个模型的制作以及它是如何被导出并导入到 WebGL 中去的。

# Blender 的界面与基本操作

如下图，就是 Blender 的界面，由多个区域组成。

- 3D viewport
- Timeline
- OutLiner
- Properties

![](https://gw.alicdn.com/imgextra/i2/O1CN01GanMJs1bJOpCM23LW_!!6000000003444-2-tps-1832-1142.png)

## 改变区域

可以点击左上角的下拉菜单，修改。如下图

![](https://gw.alicdn.com/imgextra/i4/O1CN01c2hvl11SjCaxhOOvg_!!6000000002282-2-tps-784-424.png)

## 划分与合并区域

可以将鼠标移动至区域的左上角，成为十字的时候，可以划分和合并区域，如下图

![](https://gw.alicdn.com/imgextra/i1/O1CN0157RqaW22HYrRKhz51_!!6000000007095-1-tps-1131-542.gif)

## 快捷键

Blender 的优势之一是它的快捷方式。 它们有很多，一旦你掌握了基础知识，你就会非常有效率

对于 Blender 的操作，这里建议使用鼠标，而非触摸板，因为我们会用到很多鼠标滚轮的点击。

### 旋转视角

![](https://gw.alicdn.com/imgextra/i1/O1CN01C30VKB1gFnn87ItDV_!!6000000004113-2-tps-1920-1080.png)

按住滚轮中键，移动鼠标

![](https://gw.alicdn.com/imgextra/i3/O1CN01b1RQXO1LdylfiGL6H_!!6000000001323-1-tps-974-534.gif)

### 视角平移

![](https://gw.alicdn.com/imgextra/i1/O1CN01EyeSSF1Er4mkeXlPt_!!6000000000404-2-tps-1920-1080.png)

![](https://gw.alicdn.com/imgextra/i3/O1CN019u6QSn1bUOKWzLDPm_!!6000000003468-2-tps-1920-1080.png)

按住 `shift` 同时按住鼠标中键可以进行视角平移

![](https://gw.alicdn.com/imgextra/i4/O1CN01vSjQjq1ErXBGPAv7u_!!6000000000405-1-tps-974-534.gif)

### 视角缩放

![](https://gw.alicdn.com/imgextra/i1/O1CN01RPBg8K26MpsyBBXcZ_!!6000000007648-2-tps-1920-1080.png)

鼠标滚轮旋转控制视角缩放

![](https://gw.alicdn.com/imgextra/i4/O1CN01YWSKo21Ty98SO0a5K_!!6000000002450-1-tps-719-459.gif)

需要注意的是，我们使用滚轮的缩放是不会超过物体中心的，如果想要超过中心，可以使用快捷键 `shift+ctrl+滚轮中键点击移动鼠标`。如下图

![](https://gw.alicdn.com/imgextra/i4/O1CN01VvyfH91GcXRftQFoG_!!6000000000643-1-tps-719-459.gif)

### 自由视角移动

使用自由视角移动，我们要进入 Walk mode。进入这个模式的快捷键是 `shift + back quote` 数字 1 旁边的点，然后可以用 wasd 或方向键控制前后左右平移，用鼠标控制视角，类似 FPS 游戏视角。效果如下：

![](https://gw.alicdn.com/imgextra/i4/O1CN014qzuem1pTO58yKs3O_!!6000000005361-1-tps-719-459.gif)

### 正交或景深视角切换

小键盘数字键 5 可以快速切换。

![](https://gw.alicdn.com/imgextra/i3/O1CN01HGoFsE1R8jRF0kMCi_!!6000000002067-1-tps-792-459.gif)

### 坐标轴视角

小键盘数字键 1、3、7 分别为 x、y、z 轴视角，效果如下

![](https://gw.alicdn.com/imgextra/i3/O1CN01yR0yEq1LDPnWTF8NV_!!6000000001265-1-tps-792-459.gif)

### 相机视角

小键盘数字 0 可以快速切换场景中的相机视角

![](https://gw.alicdn.com/imgextra/i1/O1CN01FOwR3T1Xw5p1R301f_!!6000000002987-1-tps-792-459.gif)

### reset

有时可能视角移动找不到场景了，这一使用快捷键 `shift + c` 回到主场景。如下图

![](https://gw.alicdn.com/imgextra/i1/O1CN01YxYkQw1RmZtjbOcdH_!!6000000002154-1-tps-792-459.gif)

### 聚焦

我们如果想聚焦到一个对象上，可以使用小键盘数字键 `.`。

![](https://gw.alicdn.com/imgextra/i3/O1CN01rCE40Z1QexhCLQbTg_!!6000000002002-1-tps-827-490.gif)

如果想聚焦到一个对象上，同时又隐藏其他对象，可以使用小键盘 `/`

![](https://gw.alicdn.com/imgextra/i2/O1CN01AyGhn01iVwzPDOuef_!!6000000004419-1-tps-827-490.gif)

### 选择

- 使用 `shift + 鼠标左键` 可以多选对象。
- 使用 `cmd + z` 可以撤销选择
- 使用 `A` 可以全选
- 使用 `双击 A` 可以全不选
- 使用 `B` 可以划区域选择
- 使用 `C` 可以类似笔刷选择，同时可以使用鼠标滚轮控制笔刷区域大小

这里举例快捷键 `B` + `双击 A`，先选中2个对象，再取消所有选择

![](https://gw.alicdn.com/imgextra/i1/O1CN01cmvV9i1nRtYkUuowf_!!6000000005087-1-tps-827-490.gif)

## 创建物体与相关操作

我们来创建物体，实际操作一下。其中也有非常多的快捷键。

创建物体之前我们先学会删除物体

### 删除物体

快捷键 `X`，选中物体，然后使用快捷键 X 进行删除操作，如下图

![](https://gw.alicdn.com/imgextra/i4/O1CN01upJyWz1oY8Zis6rWJ_!!6000000005236-1-tps-827-490.gif)

### 创建物体

快捷键 `shift + A` 出现菜单，通过菜单创建物体

![](https://gw.alicdn.com/imgextra/i4/O1CN01N9j3Yv22ln0C4a1MD_!!6000000007161-1-tps-827-490.gif)

创建好物体后，有个菜单可以控制物体的面数等信息。如果它消失了可以按快捷键 `F9` 重新打开。

![](https://gw.alicdn.com/imgextra/i2/O1CN01JZgvKB1kPCNe6r3zu_!!6000000004675-2-tps-762-470.png)

### 隐藏物体

- 选中一个物体，按 `H` 进行隐藏
- 重新展示隐藏的物体可以按 `Alt + H`
- 隐藏非选中的物体，按 `shift + H`

### 物体变换

- 使用快捷键 `G` 进行位置变换，变换后鼠标右击取消，左击确认。
- 使用快捷键 `R` 进行旋转
- 使用快捷键 `S` 进行缩放

如果使用了变换快捷键，然后再按 X、Y、Z 就可以进行轴向上的变换操作

如下图，位置变换展示，先按 G 再按 x

![](https://gw.alicdn.com/imgextra/i1/O1CN01cD8guE1bqNL4uNWXl_!!6000000003516-1-tps-827-490.gif)

### 改变模式与编辑模式

目前我们使用的是物体模式（Object Mode）我们可以改变模式方便其他操作

快捷键 `shift + tab`

![](https://gw.alicdn.com/imgextra/i3/O1CN01lUH4981DaIf5yiVI1_!!6000000000232-2-tps-683-446.png)

可以看到有以下多种模式，我们接下来会用到编辑模式，我们先来讲一下

进入 Edit Mode 后，我们可以修改顶点、线和面，同时也可以使用 `G、R、S` 这些快捷键进行编辑。

下图的操作是，按 `shift + tab` 进入 edit mode，默认选中了点操作，我们选一个顶点，按 `G` 再按 `X`，将其按照 X 轴进行移动操作。

![](https://gw.alicdn.com/imgextra/i1/O1CN01cbv7gZ1wwQV9wDKq3_!!6000000006372-1-tps-827-490.gif)

## Shading 渲染着色

我们可以使用快捷键 Z 选择不同的渲染着色方式

![](https://gw.alicdn.com/imgextra/i1/O1CN01Fm4KdX23BtZtHGth9_!!6000000007218-2-tps-1020-568.png)

- Solid: The default with the same material for every objects.
- Material: Like the Solid shading, but with a preview of the materials and their textures.
- Wireframe: All the geometries are in wireframe.
- Renderer: Low quality render —it's the most realistic but the least performant.

例如在 renderer shading 模式下的效果，可以看到光和影

![](https://gw.alicdn.com/imgextra/i2/O1CN01SUHQRT1ftMO2869Aq_!!6000000004064-1-tps-827-490.gif)

## Properties 属性区域

右下角的区域就是 Properties 区域。

![](https://gw.alicdn.com/imgextra/i2/O1CN01Zg31NI1dv4dU0UsWs_!!6000000003797-2-tps-286-412.png)

可以看到左侧的图标中间是有比较大的间距的，上面的那些是与场景相关的。

![](https://gw.alicdn.com/imgextra/i2/O1CN01QC23V225errUpu0Bk_!!6000000007552-2-tps-98-374.png)

上面的几个图标中第2个icon，是可以选择渲染引擎的。

默认是 Eevee

3个引擎的区别和特点分别是：

- Eevee: A real-time render engine. It uses the GPU just like Three.js, it's very performant, but it has limitations like realism, light bounce, reflection, and refraction.
- Workbench: A legacy render engine that we don't use a lot anymore. Its performance is pretty good, but the result isn't very realistic.
- Cycles: A raytracing engine. It's very realistic. It handles light bounce, deep reflection, deep refraction, and many other features, but it's very sluggish, and you might end up waiting hours or even days to render your scene.

默认的 Eevee 是一个实时渲染引擎。如果想渲染场景，可以按 F12 通过场景中的相机进行渲染。

下图为用 Cycles 这个光追引擎进行渲染的几个物体，非常漂亮，可以看到红色的反光效果，这就是光追效果的魅力。

![](https://gw.alicdn.com/imgextra/i4/O1CN01ehlwOT1v6Nszz5HqG_!!6000000006123-2-tps-1920-1080.png)

下面的这些是与选中的对象物体相关

![](https://gw.alicdn.com/imgextra/i4/O1CN01Kesx0n1qvc6hXCdaM_!!6000000005558-2-tps-112-498.png)

对象相关的我们暂时需要关注第1、2个，以及倒数第2个。分别是物体属性、Modifier 属性，和材质。

材质中的 `Principled BSDF` 就是使用了 PBR 原则的属性，和 Three.js 中的 MeshStandardMaterial 相同。

## 搜索

快捷键 `F3`，可以打开搜索框，可以输入关键字进行提示。

![](https://gw.alicdn.com/imgextra/i3/O1CN01r80Udh1zhGEnlHDv5_!!6000000006745-2-tps-967-507.png)

## 保存预设状态

我们将场景清空，保留一个立方体和点光源。将下面的两个视图分别改为Z和Y轴视角。并且渲染为 wireframe。然后保存预设 `File > Defaults > Save Startup File`。再次打开时就是这个界面模式了。

![](https://gw.alicdn.com/imgextra/i4/O1CN01KemDV922uwvGUzYHp_!!6000000007181-2-tps-1831-1114.png)

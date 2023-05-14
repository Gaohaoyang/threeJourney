代码组织与架构设计

之前的学习，我们都是使用一个的文件进行代码编写，在复杂项目时会遇到一些维护的问题，本文将使用面向对象的思想，来重新组织代码和设计架构，让代码可复用度更高，便于维护。

```plantuml
class Main {}
note right of Main
  Entrance
end note

class Playground {
  +HTMLCanvasElement canvas
  +Sizes sizes
  +constructor(canvas)
  ' +init()
  ' +create()
  ' +render()
  ' +update()
  ' +destroy()
}



package utils <<Frame>>{
  class Sizes {
    +number width
    +number height
    +number pixelRatio
    +constructor()
    -void onResize()
  }

  class EventEmitter {
    +on(string name, void callback)
    +off(string name)
    +trigger(string name, args)
    -off(string name)
  }
}


Main --> Playground
Playground --> Sizes
Sizes "extends" --|> EventEmitter

```

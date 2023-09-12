代码组织与架构设计

之前的学习，我们都是使用一个的文件进行代码编写，在复杂项目时会遇到一些维护的问题，本文将使用面向对象的思想，来重新组织代码和设计架构，让代码可复用度更高，便于维护。

```plantuml
class Main {}
note left of Main
  Entrance
  `new Playground(CanvasDom)`
end note

' class THREE {}
' class OrbitControls {}

class Playground<<(S,#FF7700) Singleton>>{
  +HTMLCanvasElement canvas
  +Sizes sizes
  +Time time
  +Camera camera
  +THREE.Scene scene
  +Resources resources
  -World world
  -Renderer renderer
  +constructor(canvas)
  -resize():void
  -update():void
}

class Camera {
  -Playground playground
  -Sizes sizes
  -THREE.Scene scene
  -HTMLCanvasElement canvas
  -OrbitControls controls
  +THREE.PerspectiveCamera instance
  -setInstance():void
  -setControls():void
  +resize():void
  +update():void
}

class Renderer {
  -THREE.WebGLRenderer instance
  -THREE.Scene scene
  -Playground playground
  -Sizes sizes
  -Camera camera
  -setInstance():void
  +resize():void
  +update():void
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
    +off(string name)
  }

  class Time {
    -number start
    -number current
    +number elapsed
    +number delta
    +constructor()
    -tick():void
  }

  class Resources {
    -sources
    -number toLoad
    -number loaded
    -loaders
    +items
    +constructor(sources)
    -setLoaders():void
    -startLoading():void
    -sourceLoaded():void
  }
}

package world <<Frame>> {
  class World {
    -Playground playground
    -Environment environment
    -Floor floor
    -THREE.Scene scene
    -Resources resources
    +constructor()
  }
  class Environment {
    -THREE.DirectionalLight sunLight
    -Playground playground
    -THREE.Scene scene
    -environmentMap
    -Resources resources
    +constructor()
    -setSunLight():void
    -setEnvironmentMap():void
  }
  class Floor {
    -Playground: playground
    -THREE.Scene scene
    -Resources resources
    -THREE.CircleGeometry geometry
    -textures
    -THREE.MeshStandardMaterial material
    -THREE.Mesh mesh
    +constructor()
    -setGeometry():void
    -setMaterial():void
    -setMesh():void
    -setTextures():void
  }
  entity sources {}
}


Main --> Playground
Playground ---> Sizes
Playground ---> Time
Playground ---> Resources
Playground ...> sources
' Playground ----> THREE
Playground <-- Environment
World --> Environment
World --> Floor
Playground <------> World
Playground <--> Camera
Playground <--> Renderer
' Camera --> THREE
' Renderer -> THREE
Renderer --> Sizes
Renderer -> Camera
' Camera --> OrbitControls
Sizes "extends" --|> EventEmitter
Time "extends" --|> EventEmitter
Resources "extends" --|> EventEmitter

```

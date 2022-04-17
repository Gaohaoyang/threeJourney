import * as THREE from 'three'

const scene = new THREE.Scene() // 创建场景

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
  }),
)
scene.add(cube)

const camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000)
camera.position.set(1, 1, 5)
scene.add(camera) // 相机加入场景
camera.lookAt(cube.position) // 相机视点设置为cube

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#mainCanvas') as HTMLCanvasElement,
})

renderer.render(scene, camera) // 使用渲染器渲染这个场景

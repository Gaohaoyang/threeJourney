/* eslint-disable no-param-reassign */
import * as THREE from 'three'
// import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import stats from '../common/stats'
// import { listenResize } from '../common/utils'

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null

const initThreeModel = () => {
  // Scene
  scene = new THREE.Scene()

  // Gui
  // const gui = new dat.GUI()
  // const debugObject = {
  //   envMapIntensity: 1.5,
  // }

  // Size
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.toneMappingExposure = 2.5
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.body.appendChild(renderer.domElement)

  // Camera
  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 10000)
  // camera.position.set(8, 2, -4)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.zoomSpeed = 0.3
  // controls.target = new THREE.Vector3(0, 3, 0)
  // controls.autoRotate = true

  /**
   * Objects
   */
  const testSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 32, 32),
    new THREE.MeshStandardMaterial()
  )
  scene.add(testSphere)

  /**
   * Loaders
   */
  const gltfLoader = new GLTFLoader()
  // const cubeTextureLoader = new THREE.CubeTextureLoader()

  /**
   * Update all materials
   */
  const updateAllMaterials = () => {
    scene?.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        console.log(child)
        // child.material.envMap = environmentMap
        // child.material.envMapIntensity = debugObject.envMapIntensity
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }

  // gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001)
  //   .onChange(updateAllMaterials)

  /**
   * Models
   */
  gltfLoader.load('../assets/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
    gltf.scene.scale.set(4, 4, 4)
    gltf.scene.position.set(0, -2, 0)
    gltf.scene.rotation.set(0, Math.PI * 0.5, 0)
    // gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001)
    //   .name('rotation')
    scene?.add(gltf.scene)
    updateAllMaterials()
  })

  /**
   * Light
   */
  const directionLight = new THREE.DirectionalLight('#ffffff', 2.8)
  directionLight.position.set(0.25, 3, -2.25)
  scene.add(directionLight)

  // gui.add(directionLight, 'intensity').min(0).max(10).step(0.001)
  //   .name('lightIntensity')
  // gui.add(directionLight.position, 'x').min(-5).max(5).step(0.001)
  //   .name('lightX')
  // gui.add(directionLight.position, 'y').min(-5).max(5).step(0.001)
  //   .name('lightY')
  // gui.add(directionLight.position, 'z').min(-5).max(5).step(0.001)
  //   .name('lightZ')
  directionLight.castShadow = true

  const directionalLightCameraHelper = new THREE.CameraHelper(directionLight.shadow.camera)
  scene.add(directionalLightCameraHelper)
  directionalLightCameraHelper.visible = false

  directionLight.shadow.camera.far = 15
  directionLight.shadow.mapSize.set(1024, 1024)

  /** axesHelper */
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
  axesHelper.visible = false

  // gui.add(renderer, 'toneMapping', {
  //   No: THREE.NoToneMapping,
  //   Linear: THREE.LinearToneMapping,
  //   Reinhard: THREE.ReinhardToneMapping,
  //   Cineon: THREE.CineonToneMapping,
  //   ACESFilmic: THREE.ACESFilmicToneMapping,
  // })
  // gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
  // gui.add(controls, 'autoRotate')
}

const tick = () => {
  stats.begin()
  controls?.update()

  // Render
  if (scene && camera && renderer) {
    renderer.render(scene, camera)
  }
  stats.end()
  requestAnimationFrame(tick)
}

const arButton = document.querySelector('#ar-button') as HTMLButtonElement

const notSupport = () => {
  arButton.textContent = 'Not Supported'
  arButton.disabled = true
  initThreeModel()
  camera?.position.set(8, 2, -4)
  tick()
}

let currentSession: any = null

const start = async () => {
  // 默认开始 webxr 时所有 html 元素都会消失，想现实在 ar 里需要设置下
  // @ts-ignore
  currentSession = await navigator.xr.requestSession('immersive-ar', {
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: document.body },
  })

  initThreeModel()
  if (!renderer) {
    return
  }
  // three.js 现在有内置 support webxr，需要通过 renderer.xr => Web XR manager 来工作
  renderer.xr.enabled = true

  // XR manager 会帮忙持续不断更新场景、相机的位置，然后渲染的物体能出现在锚定的物理世界里，作为开发人员只需要关注自己的 scene 就行
  // 当前物理世界的位置作为 AR 里虚拟世界的中心位置，还可以是 local floor 当前地面作为虚拟世界中心，不过可能这俩在 VR 里都有意义，在 AR 里只需 local 即可
  renderer.xr.setReferenceSpaceType('local')
  // three.js 没有 tracking 能力 需要 xr
  await renderer.xr.setSession(currentSession)

  arButton.textContent = 'End'
  tick()
}

const end = async () => {
  if (!currentSession || !renderer) {
    return
  }
  currentSession.end()
  renderer.clear()

  arButton.style.display = 'none'
}

const showStartAR = () => {
  arButton.addEventListener('click', () => {
    if (currentSession) {
      end()
    } else {
      // @ts-ignore
      window.navigator.xr
        .isSessionSupported('immersive-ar')
        .then((supported: boolean) => {
          if (supported) {
            start()
          } else {
            notSupport()
          }
        })
        .catch(() => {
          notSupport()
        })
    }
  })
}

// initThreeModel()
// tick()

const initAr = async () => {
  // 确保浏览器支持 WebXR
  if ('xr' in window.navigator) {
    showStartAR()
  } else {
    notSupport()
  }
}

initAr()

// gui.add(directionLightHelper, 'visible').name('lightHelper visible')
// gui.add(directionalLightCameraHelper, 'visible').name('lightCameraHelper visible')
// gui.add(axesHelper, 'visible').name('axesHelper visible')
// gui.add(controls, 'autoRotate')

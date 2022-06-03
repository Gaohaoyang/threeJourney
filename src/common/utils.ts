/* eslint-disable no-lonely-if */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import { PerspectiveCamera, WebGLRenderer } from 'three'

/**
 * 监听 resize 事件
 */
export const listenResize = (
  sizes: {
    width: number
    height: number
  },
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
) => {
  window.addEventListener('resize', () => {
    // update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}

/**
 * 全屏
 */
export const setFullScreen = (canvas: HTMLElement) => {
  // @ts-ignore
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
  if (fullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else {
      // @ts-ignore
      document.webkitExitFullscreen()
    }
  } else {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else {
      // @ts-ignore
      canvas.webkitRequestFullscreen()
    }
  }
}

/**
 * 双击全屏
 */
export const dbClkfullScreen = (canvas: HTMLElement) => {
  window.addEventListener('dblclick', () => {
    setFullScreen(canvas)
  })
}

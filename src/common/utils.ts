interface touchType {
  x: null | number
  y: null | number
  isTouch: boolean
}

const captureTouch = (element: HTMLElement) => {
  console.log('captureTouch')
  const touch: touchType = {
    x: null,
    y: null,
    isTouch: false,
  }
  element.addEventListener('touchstart', () => {
    touch.isTouch = true
  })
  element.addEventListener('touchend', () => {
    touch.isTouch = false
    touch.x = null
    touch.y = null
  })
  element.addEventListener('touchmove', (e) => {
    const { pageX, pageY } = e.touches[0]
    touch.x = pageX
    touch.y = pageY
  })
  return touch
}

const captureMouse = (element: HTMLElement) => {
  const mouse: {
    x: number
    y: number
    event: MouseEvent | null
  } = {
    x: 0,
    y: 0,
    event: null,
  }
  const { offsetLeft, offsetTop } = element

  element.addEventListener('mousemove', (e) => {
    let x
    let y
    x = e.pageX
    y = e.pageY
    x -= offsetLeft
    y -= offsetTop
    mouse.x = x
    mouse.y = y
    mouse.event = e
  })
  return mouse
}

/**
 * 是否包含在区域内
 */
const containPoint = (
  rect: {
    x: number
    y: number
    width: number
    height: number
  },
  x: number,
  y: number,
) => x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height

export { captureTouch, captureMouse, containPoint }

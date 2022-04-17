class Ball {
  radius: number

  color: string

  x: number

  y: number

  lineWidth: number

  vx: number

  vy: number

  constructor(radius: number = 40, color: string = '#795548') {
    this.radius = radius
    this.color = color
    this.x = 0
    this.y = 0
    this.vx = 0
    this.vy = 0
    this.lineWidth = 1
  }

  /**
   * draw
   */
  public draw(context: CanvasRenderingContext2D) {
    context.save()
    context.translate(this.x, this.y)
    context.lineWidth = this.lineWidth
    context.fillStyle = this.color
    context.beginPath()
    context.arc(0, 0, this.radius, 0, Math.PI * 2, true)
    context.closePath()
    context.fill()
    if (this.lineWidth > 0) {
      context.stroke()
    }
    context.restore()
  }

  /**
   * getBounds
   */
  public getBounds() {
    return {
      x: this.x - this.radius, // 边界左上角的点x
      y: this.y - this.radius, // 边界左上角的点y
      width: this.radius * 2,
      height: this.radius * 2,
    }
  }
}

export default Ball

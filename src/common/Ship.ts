/* eslint-disable no-param-reassign */
class Ship {
  x = 0

  y = 0

  width = 25

  height = 20

  rotation = 0

  showFlame = false

  /**
   * draw
   */
  public draw(c: CanvasRenderingContext2D) {
    c.save()
    c.translate(this.x, this.y)
    c.rotate(this.rotation)
    c.lineWidth = 1
    c.strokeStyle = '#ffffff'
    c.beginPath()
    c.moveTo(10, 0)
    c.lineTo(-10, 10)
    c.lineTo(-5, 0)
    c.lineTo(-10, -10)
    c.lineTo(10, 0)
    c.stroke()

    if (this.showFlame) {
      c.beginPath()
      c.moveTo(-7.5, -5)
      c.lineTo(-15, 0)
      c.lineTo(-7.5, 5)
      c.stroke()
    }

    c.restore()
  }
}

export default Ship

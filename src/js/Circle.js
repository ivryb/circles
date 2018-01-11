export class Circle {
  constructor(params) {
    this.ctx = params.ctx
    this.pos = params.pos
    this.size = params.size
    this.color = params.color || 'black'
    this.stroke = params.stroke || 'transparent'
  }

  draw() {
    this.ctx.beginPath()

    this.ctx.fillStyle = this.color
    this.ctx.strokeStyle = this.stroke

    this.ctx.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI)

    this.ctx.fill()
    this.ctx.stroke()
  }

  checkDistance(circle) {
    return this.size + circle.size >= Math.sqrt(Math.pow(this.pos.x - circle.pos.x, 2) + Math.pow(this.pos.y - circle.pos.y, 2))
  }

  isOutOfField({ width, height }) {
    return this.pos.x + this.size <= 0 || this.pos.x - this.size >= width || this.pos.y - this.size >= height || this.pos.y + this.size <= 0
  }
}

export class Vec2 {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  add({ x, y }) {
    this.x += x
    this.y += y

    return this
  }

  multiply(scalar) {
    this.x *= scalar
    this.y *= scalar

    return this
  }

  clone() {
    return new Vec2(this.x, this.y)
  }

  static direction(x, y) {
    const max = Math.max(Math.abs(x), Math.abs(y))

    return new Vec2(x / max, y / max)
  }
}

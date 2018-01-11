export class Vec2 {
  constructor(x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  add({ x, y }) {
    return new Vec2(this.x + x, this.y + y)
  }

  multiply(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar)
  }

  clone() {
    return new Vec2(this.x, this.y)
  }

  static unit(x, y) {
    const max = Math.max(Math.abs(x), Math.abs(y))

    return new Vec2(x / max, y / max)
  }
}

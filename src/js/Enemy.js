import { Circle } from './Circle'
import { Vec2 } from './Vec2'

export class Enemy {
  constructor(game, player) {
    this.circle = new Circle({
      ctx: game.ctx,
      pos: new Vec2(),
      size: player.circle.size,
      color: 'orange'
    })

    this.game = game
    this.player = player
    this.speed = this.player.speed * .5
    this.direction = new Vec2()

    this.circle.pos = this.getInitialPosition()
  }

  getInitialPosition() {
    switch (Math.floor(Math.random() * 4)) {
      case 0:
        return new Vec2(-this.circle.size, Math.random() * this.game.height)
      case 1:
        return new Vec2(this.game.width + this.circle.size, Math.random() * this.game.height)
      case 2:
        return new Vec2(Math.random() * this.game.width, -this.circle.size)
      case 3:
        return new Vec2(Math.random() * this.game.width, this.game.height + this.circle.size)
    }
  }

  move() {
    this.direction = new Vec2.direction(this.player.circle.pos.x - this.circle.pos.x, this.player.circle.pos.y - this.circle.pos.y)
    this.circle.pos.add(this.direction.clone().multiply(this.speed))
  }

  update() {
    this.move()
    this.circle.draw()
  }
}

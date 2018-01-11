import { Circle } from './Circle'
import { Vec2 } from './Vec2'

export class Bullet {
  constructor(game, unit, direction, config) {
    this.circle = new Circle({
      ctx: game.ctx,
      pos: config.startPos ? config.startPos : unit.circle.pos.clone(),
      size: config.size || 5,
      color: config.color || unit.circle.color
    })

    this.game = game
    this.unit = unit
    this.direction = direction
    this.sizeUp = config.sizeUp || 0
    this.speed = config.speed || 15
    this.speedUp = config.speedUp || 0

    this.piercing = Boolean(config.piercing)
  }

  update(i) {
    this.circle.pos = this.circle.pos.add(this.direction.multiply(this.speed))

    this.speed += this.speedUp

    this.circle.draw()

    if (this.circle.size >= Math.abs(this.sizeUp)) {
      this.circle.size += this.sizeUp
    } else {
      this.circle.size = 0
    }

    this.kill(i)
  }

  kill(i) {
    if (this.circle.size === 0 || this.circle.isOutOfField(this.game)) {
      this.unit.removeBullet(i)
    } else {
      this.game.enemies.reduceRight((result, enemy, index) => {
        if (this.circle.checkDistance(enemy.circle)) {
          this.game.removeEnemy(index)
          this.shoot(i)
        }
      }, null)
    }
  }

  shoot(i) {
    if (!this.piercing) {
      return this.unit.removeBullet(i)
    }
  }
}

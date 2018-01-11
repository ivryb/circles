import { Circle } from './Circle'
import { Vec2 } from './Vec2'

export class Bomb {
  constructor(game, unit) {
    this.circle = new Circle({
      ctx: game.ctx,
      pos: unit.circle.pos.clone(),
      size: 15,
      color: 'white',
      stroke: 'red'
    })

    this.game = game
    this.unit = unit
    this.active = false

    setTimeout(() => {
      this.activate()
    }, 350)
  }

  activate() {
    this.active = true
    this.circle.color = 'red'
  }

  update(i) {
    this.circle.draw()

    if (this.active) {
      const targets = this.game.enemies.concat(this.unit.bullets)

      targets.reduceRight((result, target) => {
        if (target !== this && this.circle.checkDistance(target.circle)) {
          this.detonate(i)
        }
      }, null)
    }
  }

  detonate(index) {
    this.unit.doubleSpray({
      pos: this.circle.pos,
      color: this.circle.color
    })

    this.unit.removeBullet(index)
  }
}

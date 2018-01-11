import { includes, uniq, concat, without, range } from 'lodash/fp'

import { Vec2 } from './Vec2'
import { Circle } from './Circle'
import { Bullet } from './Bullet'
import { Bomb } from './Bomb'

export class Player {
  constructor(game) {
    this.circle = new Circle({
      ctx: game.ctx,
      pos: new Vec2(game.width / 2, game.height / 2),
      size: 20,
      color: 'black'
    })

    this.game = game

    this.speed = 10
    this.direction = new Vec2()

    this.cursor = new Vec2()

    this.bullets = []
    this.keys = []

    this.initKeys()
    this.initMouse()
  }

  updateCursor({ x, y }) {
    this.cursor = { x, y }
  }

  updateBullets() {
    this.bullets.reduceRight((result, bullet, i) => bullet.update(i), null)
  }

  removeBullet(i) {
    this.bullets.splice(i, 1)
  }

  update() {
    this.move()
    this.updateBullets()
    this.circle.draw()
  }

  shot() {
    this.bullets.push(new Bullet(this.game, this, Vec2.unit(this.cursor.x - this.circle.pos.x, this.cursor.y - this.circle.pos.y), {
      size: 5,
      speed: 15
    }))
  }

  placeBomb() {
    this.bullets.push(new Bomb(this.game, this))
  }

  bigShot() {
    this.bullets.push(new Bullet(this.game, this, Vec2.unit(this.cursor.x - this.circle.pos.x, this.cursor.y - this.circle.pos.y), {
      size: 4,
      speed: 13,
      sizeUp: 2.5,
      piercing: true
    }))
  }

  doubleSpray({ pos, color }) {
    this.spray({ pos, color })
    setTimeout(() => {
      this.spray({ pos, color, offset: 1 })
    }, 50)
  }

  spray({ pos, color, offset }) {
    const count = 24

    range(0, count).map((i) => {
      const iteration = (i / count * 2 * Math.PI) + (offset ? Math.PI / count : 0)

      this.bullets.push(new Bullet(this.game, this, new Vec2(Math.cos(iteration), Math.sin(iteration)), {
        size: 4,
        speed: 8,
        sizeUp: -.1,
        speedUp: -.1,
        startPos: pos.clone(),
        color: color,
        piercing: true
      }))
    })
  }

  move() {
    const border = this.circle.size * 4

    const canMoveUp = this.circle.pos.y + border < this.game.height
    const canMoveDown = this.circle.pos.y - border > 0
    const canMoveLeft = this.circle.pos.x - border > 0
    const canMoveRight = this.circle.pos.x + border < this.game.width

    const movingUp = this.keys.includes(83) || this.keys.includes(40)
    const movingDown = this.keys.includes(87) || this.keys.includes(38)
    const movingLeft = this.keys.includes(65) || this.keys.includes(37)
    const movingRight = this.keys.includes(68) || this.keys.includes(39)

    if (movingUp && canMoveUp) {
      this.direction.y = 1
    }

    if (movingDown && canMoveDown) {
      this.direction.y = -1
    }

    if (movingRight && canMoveRight) {
      this.direction.x = 1
    }

    if (movingLeft && canMoveLeft) {
      this.direction.x = -1
    }

    this.direction = this.direction.multiply(.87)

    this.circle.pos = this.circle.pos.add(this.direction.multiply(this.speed))
  }

  initKeys() {
    const moveKeys = [65, 87, 68, 83, 37, 38, 39, 40]

    document.addEventListener('keydown', ({ which }) => {
      if (includes(which, moveKeys)) {
        this.keys = uniq(concat(this.keys, [which]))
      }

      if (which === 32) {
        this.placeBomb()
      }

      if (which === 17) {
        return this.doubleSpray({
          pos: this.circle.pos.clone()
        })
      }
    })

    document.addEventListener('keyup', ({ which }) => {
      if (includes(which, moveKeys)) {
        this.keys = without([which], this.keys)
      }
    })
  }

  initMouse() {
    this.game.canvas.addEventListener('mousemove', (e) => {
      this.updateCursor({
        x: e.pageX,
        y: e.pageY
      })
    })

    this.game.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      this.bigShot()
    })

    this.game.canvas.addEventListener('click', (e) => {
      e.preventDefault()
      this.shot()
    })
  }
}

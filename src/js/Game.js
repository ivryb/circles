import { Player } from './Player'
import { Enemy } from './Enemy'

export class Game {
  constructor({ canvas }) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")

    const { width, height } = canvas.getBoundingClientRect()

    this.canvas.width = width
    this.canvas.height = height
    this.width = width
    this.height = height

    this.spawner = null
    this.enemies = []

    this.player = new Player(this)

    this.start()
  }

  start() {
    this.startSpawner()
    this.tick()
  }

  startSpawner() {
    this.spawner = setInterval(() => {
      this.enemies.push(new Enemy(this, this.player))
    }, 700)
  }

  removeEnemy(i) {
    this.enemies.splice(i, 1)
  }

  updateEnemies() {
    this.enemies.map((enemy) => enemy.update())
  }

  clearField() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  tick() {
    requestAnimationFrame(this.tick.bind(this))

    this.clearField()
    this.updateEnemies()
    this.player.update()
  }
}

(function() {
  var Bomb, Bullet, Circle, Enemy, Game, Player, Vector, canvas, game,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Vector = (function() {
    function Vector(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Vector.prototype.add = function(vec) {
      this.x += vec.x;
      return this.y += vec.y;
    };

    Vector.prototype.multiply = function(scalar) {
      this.x *= scalar;
      return this.y *= scalar;
    };

    Vector.direction = function(x, y) {
      var max;
      max = Math.max(Math.abs(x), Math.abs(y));
      return new Vector(x / max, y / max);
    };

    return Vector;

  })();

  Game = (function() {
    function Game(canvas1) {
      this.canvas = canvas1;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context = canvas.getContext("2d");
      this.player = new Player(this);
      this.enemies = [];
      this.start();
    }

    Game.prototype.start = function() {
      this.tick();
      return this.spawner();
    };

    Game.prototype.spawner = function() {
      return setInterval((function(_this) {
        return function() {
          return _this.enemies.push(new Enemy(_this, _this.player));
        };
      })(this), 700);
    };

    Game.prototype.removeEnemy = function(i) {
      return this.enemies.splice(i, 1);
    };

    Game.prototype.updateEnemies = function() {
      return this.enemies.forEach(function(enemy, i) {
        return enemy.update();
      });
    };

    Game.prototype.tick = function() {
      requestAnimationFrame(this.tick.bind(this));
      this.context.clearRect(0, 0, this.width, this.height);
      this.updateEnemies();
      return this.player.update();
    };

    return Game;

  })();

  Circle = (function() {
    function Circle() {}

    Circle.prototype.draw = function() {
      this.game.context.fillStyle = this.color;
      if (this.stroke) {
        this.game.context.strokeStyle = this.stroke;
      }
      this.game.context.beginPath();
      this.game.context.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI);
      this.game.context.fill();
      if (this.stroke) {
        return this.game.context.stroke();
      }
    };

    Circle.prototype.checkDistance = function(el1, el2) {
      return el1.size + el2.size >= Math.sqrt(Math.pow(el1.pos.x - el2.pos.x, 2) + Math.pow(el1.pos.y - el2.pos.y, 2));
    };

    Circle.prototype.outOfCanvas = function(unit) {
      return unit.pos.x + unit.size <= 0 || unit.pos.x - unit.size >= unit.game.width || unit.pos.y - unit.size >= unit.game.height || unit.pos.y + unit.size <= 0;
    };

    return Circle;

  })();

  Player = (function(superClass) {
    extend(Player, superClass);

    function Player(game1) {
      this.game = game1;
      this.color = "black";
      this.size = 20;
      this.speed = 10;
      this.pos = new Vector(this.game.width / 2, this.game.height / 2);
      this.direction = new Vector;
      this.bullets = [];
      this.keys = [];
      document.addEventListener('keydown', (function(_this) {
        return function(e) {
          var ref, ref1;
          if (((ref = e.which) === 65 || ref === 87 || ref === 68 || ref === 83 || ref === 32 || ref === 37 || ref === 38 || ref === 39 || ref === 40) && (ref1 = e.which, indexOf.call(_this.keys, ref1) < 0)) {
            _this.keys.push(e.which);
          }
          if (e.which === 32) {
            _this.bomb();
          }
          if (e.which === 17) {
            return _this.doubleSpray(_this.pos);
          }
        };
      })(this));
      document.addEventListener('keyup', (function(_this) {
        return function(e) {
          var ref;
          if ((ref = e.which) === 65 || ref === 87 || ref === 68 || ref === 83 || ref === 32 || ref === 37 || ref === 38 || ref === 39 || ref === 40) {
            return _this.keys.forEach(function(item, i) {
              if (e.which === item) {
                return _this.keys.splice(i, 1);
              }
            });
          }
        };
      })(this));
      this.game.canvas.addEventListener('contextmenu', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.updateCursor(e);
          return _this.bigShot();
        };
      })(this));
      this.game.canvas.addEventListener('click', (function(_this) {
        return function(e) {
          _this.updateCursor(e);
          return _this.shot();
        };
      })(this));
    }

    Player.prototype.updateCursor = function(e) {
      return this.cursor = new Vector(e.pageX, e.pageY);
    };

    Player.prototype.updateBullets = function() {
      var difference, i, j, ref, results;
      difference = 0;
      if (this.bullets.length) {
        results = [];
        for (i = j = 0, ref = this.bullets.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if (this.bullets[i - difference] && this.bullets[i - difference].update(i - difference)) {
            results.push(difference++);
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    };

    Player.prototype.removeBullet = function(i) {
      this.bullets.splice(i, 1);
      return true;
    };

    Player.prototype.update = function() {
      this.move();
      this.updateBullets();
      return this.draw();
    };

    Player.prototype.move = function() {
      this.keys.forEach((function(_this) {
        return function(item, i) {
          if ((item === 65 || item === 37) && (_this.pos.x - _this.size * 3 > 0)) {
            _this.direction.x = -1;
          }

          if ((item === 87 || item === 38) && (_this.pos.y - _this.size * 3 > 0)) {
            _this.direction.y = -1;
          }

          if ((item === 68 || item === 39) && (_this.pos.x + _this.size * 3 < _this.game.width)) {
            _this.direction.x = 1;
          }

          if ((item === 83 || item === 40) && _this.pos.y + _this.size * 3 < _this.game.height) {
            _this.direction.y = 1;
          }
        };
      })(this));
      this.direction.multiply(.87);
      return this.pos.add(new Vector(this.direction.x * this.speed, this.direction.y * this.speed));
    };

    Player.prototype.shot = function() {
      return this.bullets.push(new Bullet(this.game, this, Vector.direction(this.cursor.x - this.pos.x, this.cursor.y - this.pos.y), {
        size: 5,
        speed: 15
      }));
    };

    Player.prototype.bigShot = function() {
      return this.bullets.push(new Bullet(this.game, this, Vector.direction(this.cursor.x - this.pos.x, this.cursor.y - this.pos.y), {
        size: 4,
        speed: 13,
        sizeUp: 2.5,
        destroyable: false
      }));
    };

    Player.prototype.doubleSpray = function(startPos) {
      this.spray(startPos, 0);
      return setTimeout((function(_this) {
        return function() {
          return _this.spray(startPos, 1);
        };
      })(this), 50);
    };

    Player.prototype.spray = function(startPos, offset) {
      var count, i, iteration, j, ref, results;
      count = 24;
      if (offset) {
        offset = Math.PI / count;
      }
      results = [];
      for (i = j = 1, ref = count; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        iteration = i / count * 2 * Math.PI + offset;
        results.push(this.bullets.push(new Bullet(this.game, this, new Vector(Math.cos(iteration), Math.sin(iteration)), {
          size: 4,
          speed: 8,
          sizeUp: -.1,
          speedUp: -.1,
          startPos: startPos
        })));
      }
      return results;
    };

    Player.prototype.bomb = function() {
      return this.bullets.push(new Bomb(this.game, this));
    };

    return Player;

  })(Circle);

  Bullet = (function(superClass) {
    extend(Bullet, superClass);

    function Bullet(game1, unit1, direction, config) {
      var ref, ref1, ref2, ref3, ref4, ref5;
      this.game = game1;
      this.unit = unit1;
      this.direction = direction;
      this.color = (ref = config.color) != null ? ref : this.unit.color;
      this.size = (ref1 = config.size) != null ? ref1 : 5;
      this.sizeUp = (ref2 = config.sizeUp) != null ? ref2 : 0;
      this.speed = (ref3 = config.speed) != null ? ref3 : 15;
      this.speedUp = (ref4 = config.speedUp) != null ? ref4 : 0;
      if (config.startPos) {
        this.pos = new Vector(config.startPos.x, config.startPos.y);
      } else {
        this.pos = new Vector(this.unit.pos.x, this.unit.pos.y);
      }
      this.destroyable = (ref5 = config.destroyable) != null ? ref5 : true;
    }

    Bullet.prototype.update = function(i) {
      this.pos.add(new Vector(this.direction.x * this.speed, this.direction.y * this.speed));
      this.speed += this.speedUp;
      this.draw();
      if (this.size >= Math.abs(this.sizeUp)) {
        this.size += this.sizeUp;
      } else {
        this.size = 0;
      }
      return this.kill(i);
    };

    Bullet.prototype.kill = function(i) {
      if (this.size === 0 || this.outOfCanvas(this)) {
        return this.unit.removeBullet(i);
      } else {
        return this.game.enemies.forEach((function(_this) {
          return function(enemy, index) {
            if (_this.checkDistance(_this, enemy)) {
              _this.game.removeEnemy(index);
              if (_this.destroyable) {
                return _this.unit.removeBullet(i);
              }
            }
          };
        })(this));
      }
    };

    return Bullet;

  })(Circle);

  Bomb = (function(superClass) {
    extend(Bomb, superClass);

    function Bomb(game1, unit1) {
      this.game = game1;
      this.unit = unit1;
      this.pos = new Vector(this.unit.pos.x, this.unit.pos.y);
      this.color = "white";
      this.stroke = "red";
      this.size = 15;
      this.active = false;
      setTimeout((function(_this) {
        return function() {
          _this.active = true;
          return _this.color = "red";
        };
      })(this), 350);
    }

    Bomb.prototype.update = function(i) {
      this.draw();
      return this.kill(i);
    };

    Bomb.prototype.kill = function(index) {
      var i, j, ref;
      if (this.game.enemies.length) {
        for (i = j = 0, ref = this.game.enemies.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          if (this.active && this.game.enemies[i] && this.checkDistance(this, this.game.enemies[i])) {
            this.unit.doubleSpray(this.pos);
            return this.unit.removeBullet(index);
          }
        }
      }
    };

    return Bomb;

  })(Circle);

  Enemy = (function(superClass) {
    extend(Enemy, superClass);

    function Enemy(game1, player) {
      this.game = game1;
      this.player = player;
      this.color = "orange";
      this.speed = this.player.speed * .75;
      this.size = this.player.size;
      switch (Math.floor(Math.random() * 4)) {
        case 0:
          this.pos = new Vector(-this.size, Math.floor(Math.random() * this.game.height));
          break;
        case 1:
          this.pos = new Vector(this.game.width + this.size, Math.floor(Math.random() * this.game.height));
          break;
        case 2:
          this.pos = new Vector(Math.floor(Math.random() * this.game.width), -this.size);
          break;
        case 3:
          this.pos = new Vector(Math.floor(Math.random() * this.game.width), this.game.height + this.size);
      }
      this.direction = new Vector;
    }

    Enemy.prototype.update = function() {
      this.move();
      return this.draw();
    };

    Enemy.prototype.move = function() {
      this.direction = new Vector.direction(this.player.pos.x - this.pos.x, this.player.pos.y - this.pos.y);
      return this.pos.add(new Vector(this.direction.x * this.speed, this.direction.y * this.speed));
    };

    return Enemy;

  })(Circle);

  canvas = document.getElementById("canvas");

  game = new Game(canvas);

}).call(this);

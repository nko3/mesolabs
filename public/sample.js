enchant();

var LIMIT_TIME = 30;

window.onload = function() {

  var game = new Game(320, 320);
  game.preload(['images/monster/monster1.gif']);
  game.score = 0;
  
  game.onload = function() {
    var timeLabel = new Label();
    timeLabel.x = timeLabel.y = 2;
    timeLabel._element.style.zIndex = 128;
    timeLabel.addEventListener(Event.ENTER_FRAME, function() {
      var progress = parseInt(game.frame / game.fps);
      var limit = LIMIT_TIME - progress;
      this.text = "リミット: " + limit;
      if (limit <= 0) {
        gameOver();
      }
    });
    game.rootScene.addChild(timeLabel);
    
    var score = new Label();
    score.x = score.y = 16;
    score.text = "スコア: " + 100;
    score._element.style.zIndex = 128;
    score.addEventListener(Event.ENTER_FRAME, function() {
      this.text = "スコア: " + game.score;
    });
    game.rootScene.addChild(score);
    
    for (var i = 0; i < 10; ++i) {
//      var enemy = new Avatar("2:2:0:2064:21230:2222");
//      enemy.action="stop";
//      var enemy = new EnemySprite();
      var enemy = new MyAvatar("2:2:0:2064:21230:2222");
      enemy.x = Math.random() * 320;
      enemy.y = Math.random() * 320;
      game.rootScene.addChild(enemy);
      enemy.action = "run";
    }
    
  }
  
  game.rootScene.backgroundColor = 'rgb(240, 255, 255)';
  game.start();
}

var gameOver = function() {
  var game = Game.instance;
  
  var scene = new Scene();
  scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  game.replaceScene(scene);
  
  var gameoverLabel = new CenterLabel("white");
  gameoverLabel.y = 150;
  gameoverLabel.text = "Game Over!!";
  scene.addChild(gameoverLabel);
}

var CenterLabel = Class.create(Label, {
  initialize: function(color) {
    Label.call(this);
    
    this.width = 320;
    this._element.style.textAlign = "center";
    
    color = color || "white";
    this.color = color;
  }
});;

var ArcSprite = Class.create(Sprite, {
  initialize: function(radius) {
    Sprite.call(this, radius * 2, radius * 2);
//    var game = Game.instance;
//    var gif = game.assets['../images/monster/monster1.gif'];
//    var monster = new AvatarMonster(gif);
    var enemy = new Avatar("2:2:0:2064:21230:2222");
    this.image = enemy;
  }
});

var MyAvatar = Class.create(Avatar, {
  initialize: function(code) {
    Avatar.call(this, code);

    this.addEventListener(Event.TOUCH_START, this.onTouch);
    this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);

    var rad = Math.random() * 360 * Math.PI / 180;
    this.vx = Math.cos(rad) * EnemySprite.SPEED;
    this.vy =- Math.sin(rad) * EnemySprite.SPEED;

    this._element.style.zIndex = 4;
  },

  onTouch: function(e) {
    var game = Game.instance;
    var scene = game.rootScene;

    game.score += 100;
    var crush = new CrushParticle();
    crush.moveTo(
      this.x + this.width / 2 - 4,
      this.y + this.height / 2 - 4
    );
    scene.addChild(crush);

    scene.removeChild(this);

    var enemy = new MyAvatar("2:2:0:2064:21230:2222");
    enemy.x = Math.random() * 320;
    enemy.y = Math.random() * 320;
    enemy.scaleX *= -1;
    scene.addChild(enemy);
    enemy.action = "run";
  },

  onEnterFrame: function() {
    var scene = this.parentNode;

    this.moveBy(this.vx, this.vy);

    var left = this.x;
    var right = this.x + this.width;
    var top = this.y;
    var bottom = this.y + this.height;

    if (left < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (top < 0) {
      this.y = 0;
      this.vy *= -1;
    }
    if (right > scene.width) {
      this.x = scene.width - this.width;
      this.vx *= -1;
    }
    if (bottom > scene.width) {
      this.y = scene.height - this.height;
      this.vy *= -1;
    }
  }
});



var EnemySprite = Class.create(ArcSprite, {
  initialize: function() {
    ArcSprite.call(this, EnemySprite.RADIUS);
    
    this.addEventListener(Event.TOUCH_START, this.onTouch);
    this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);
    
    var rad = Math.random() * 360 * Math.PI / 180;
    this.vx = Math.cos(rad) * EnemySprite.SPEED;
    this.vy =- Math.sin(rad) * EnemySprite.SPEED;
    
    this._element.style.zIndex = 4;
  },
  
  onTouch: function(e) {
    var game = Game.instance;
    var scene = game.rootScene;
    
    game.score += 100;
    var crush = new CrushParticle();
    crush.moveTo(
      this.x + this.width / 2 - 4,
      this.y + this.height / 2 - 4
    );
    scene.addChild(crush);

    
    scene.removeChild(this);
    
    var enemy = new EnemySprite();
    enemy.x = Math.random() * 320;
    enemy.y = Math.random() * 320;
    scene.addChild(enemy);
  },
  
  onEnterFrame: function() {
    var scene = this.parentNode;

    this.image.action = "run";
    this.moveBy(this.vx, this.vy);
    
    var left = this.x;
    var right = this.x + this.width;
    var top = this.y;
    var bottom = this.y + this.height;
    
    if (left < 0) {
      this.x = 0;
      this.vx *= -1;
    }
    if (top < 0) {
      this.y = 0;
      this.vy *= -1;
    }
    if (right > scene.width) {
      this.x = scene.width - this.width;
      this.vx *= -1;
    }
    if (bottom > scene.width) {
      this.y = scene.height - this.height;
      this.vy *= -1;
    }
  }
});

var CrushParticle = Class.create(Group, {
  initialize: function() {
    Group.call(this);

    this.addEventListener(Event.ENTER_FRAME, this.onEnterFrame);

    for(var i = 0; i < 8; ++i) {
      var particle = new Avatar("2:2:0:2064:21230:2222");
      particle.x = particle.y = 0;

      var rad = 2 * Math.PI / 8 * i;
      particle.vx = Math.cos(rad);
      particle.vy =- Math.sin(rad);

      particle.life = 30;

      particle.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity = this.life / 30;
        this.life -= 1;
        return this.life > 0;
      }
      this.addChild(particle);
    }
  },

  onEnterFrame: function() {
    for (var i = 0; i < this.childNodes.length; ++i) {
      var particle = this.childNodes[i];
      if (particle.update() == false) {
        this.removeChild(particle);
      }
    }

    if (this.childNodes.length <= 0) {
      var p = this.parentNode;
      p.removeChild(this);
    }
  }
});

EnemySprite.RADIUS = 64;
EnemySprite.SPEED = 2;
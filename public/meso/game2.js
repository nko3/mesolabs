enchant();
var MOB1 = '../images/monster/monster1.gif';

window.onload = function() {
  var game = new Game(320, 320);
  game.preload([MOB1]);
  game.onload = function() {
    var world = new PhysicsWorld(0.0, 9.8);

    var pos = [
      {x:144, y:32},
      {x:160, y:32},
      {x:176, y:32},
      {x:152, y:48},
      {x:168, y:48},
      {x:160, y:64}
    ];

    for (var i = 0; i < pos.length; i++) {
      var mob = new PhyCircleSprite(8, box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.8, true);
      var avatar = new AvatarMonster(game.assets(MOB1));
      avatar.action = "run";
      mob.image = avatar;
      mob.frame = i + 2;
      mob.position = pos[i];
      game.rootScene.addChild(mob);
    }
    //リンゴを置く
    apple = new PhyCircleSprite(8, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.5, 0.8, true);
    apple.image = game.assets['icon0.gif'];
    apple.frame = 15;
    apple.position = {
      x: 160,
      y: 296
    };
    game.rootScene.addChild(apple);
    //床を設置する
    floor = new PhyBoxSprite(320, 16, enchant.box2d.STATIC_SPRITE, 1.0, 0.5, 0.0, true);
    floor.image = new Surface(16, 16);
    floor.image.draw(game.assets['map2.gif'],0,0,16,16,0,0,16,16);
    floor.position = {
      x: 160,
      y: 312
    };
    game.rootScene.addChild(floor);

    apple.addEventListener(Event.TOUCH_END, function(e) {
      // 昔なつかし三角関数
      p = this.position;
      h = Math.sqrt(Math.pow(e.x - p.x, 2) + Math.pow(e.y - p.y, 2));
      a = (e.x - p.x) / h;
      b = (e.y - p.y) / h;
      // 条件によっては a、b を求められない場合があるので、その場合は 0 に変更する
      a = isNaN(a) ? 0 : a;
      b = isNaN(b) ? 0 : b;
      // applyImpulse は瞬発力をオブジェクトに加える関数
      // b2Vec2 は box2d で扱うベクトル
      // ここにコードを追加
      this.applyImpulse(new b2Vec2(-1 * a, -5 * b));
    });

    game.rootScene.onenterframe = function(e) {
      //物理世界の時間を進める
      world.step(game.fps);
    };
  };
  game.start();
}
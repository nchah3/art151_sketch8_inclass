//SKETCH 8
//COMPLETED BY: Nihal Chahal
///DATE: 

nn.on("load", () => {

  // KAPLAY SETUP

  kaplay({

    // button setup

    buttons: {
      moveUp: {
        keyboard: ["up", "w"],
        gamepad: ["dpad-up"],
      },
      moveDown: {
        keyboard: ["down", "s"],
        gamepad: ["dpad-down"],
      },
      moveLeft: {
        keyboard: ["left", "a"],
        gamepad: ["dpad-left"],
      },
      moveRight: {
        keyboard: ["right", "d"],
        gamepad: ["dpad-right"],
      },
    },

    // background color
    background:[211,211,211]

    // background settings

  });



  // GLOBAL VARIABLES


  const SPEED = 120;
  const JUMP_FORCE = 500;
  const DEADZONE = 0.15;

  let soundEffect;
  let isPlaying = false;
  let bgm;

  let timeLeft = 30;
  let gameScore = 0;

  let spawnSide = "left";




  // SPRITES

  // player sprite

  loadSprite("knight", "assets/knight_walk.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
      walkUp: { from: 0, to: 3, loop: true },
      walkLeft: { from: 4, to: 7, },
      walkRight: { from: 8, to: 11, loop: true },
      walkDown: { from: 12, to: 15, loop: true },
    },
  });

  // collectible sprite

  loadSprite("gold coin", "assets/gold_coin.png");

  // enemy sprite

  loadSprite(
    "slime_enemy", "assets/slime_enemy.png");

  // AUDIO ASSETS

  loadSound("pickup", "assets/coin_pickup.wav");

  loadSound("jump", "assets/jump.wav");

  loadMusic("bgm","assets/background_music.ogg");



  // HELPERS

  function playSoundEffect () {

    // sound logic

  }



  function makePlatform (x, y, w, colorValue) {

    add([
      rect(w, 32),
      pos(x, y),
      color(colorValue),
      area(),
      body({ isStatic: true }),
    ]);
  }



  function spawnCollectible(x = width() / 2, y = height() - 56) {
    add([
      sprite("gold coin"),
      pos(x, y),
      scale(3),
      area(),
      "collectible",
    ])

  }



  function spawnEnemy () {
    const leftEdge = width() * 0.6;
    const rightEdge = width() - 56;
    let direction = -1;

    const enemy = add([
      sprite("slime_enemy"),
      pos(rightEdge, height() - 80),
      scale(3),
      area(),
      "enemy",
    ]);

    enemy.onUpdate(() => {
      enemy.move(60 * direction, 0);
      
      if (enemy.pos.x <= leftEdge) {
        enemy.pos.x = leftEdge;
        direction = 1;
      } else if (enemy.pos.x >= rightEdge) {
        enemy.pos.x = rightEdge;
        direction = -1;
      }
    })

  }



  function spawnEnemyWave () {

    // wave logic

  }



  // LVL 1 SCENE

  scene("level1", () => {
    onKeyPress("space", toggleMusic);

    setGravity(640);

    let facing = RIGHT;
    let hitSlime = false;

    const scoreText = add([
      text("Score: " + gameScore, { size: 24 }),
      pos(16, 16),
      color(32, 40, 35),
    ]);

    const timer = add([

      // timer display

    ]);



    const player = add([
      sprite("knight", { frame: 8 }),
      pos(80, 80),
      scale(3),
      area(),
      body(),
    ]);



    // LEVEL EXIT

    const levelExit = add([

      // exit setup

    ]);



    // PLATFORMS

    makePlatform(0, height() - 32, width(), rgb(76, 96, 79));



    for (let i = 0; i < 5; i++) {

      // random platforms

    }



    // COLLECTIBLES

    for (let i = 0; i < 5; i++) {
      const x = width() * (i + 3) / 8;
      const y = height() - 56 - i * 20;
      spawnCollectible(x, y);
    }

    // collectible loop



    // ENEMIES

    spawnEnemy();

    // enemy loop



    // CONTROLS

    onButtonDown("moveRight", () => {
      player.move(SPEED, 0);
      player.frame = 8;
    });



    onButtonDown("moveLeft", () => {
      player.move(-SPEED, 0);
      player.frame = 4;
    });



    onButtonPress("moveUp", () => {
      if (player.isGrounded()) {
        player.jump(JUMP_FORCE);
        play("jump");
      }
    });



    onButtonDown("moveDown", () => {

      // move down

    });



    // PROJECTILES

    function shoot () {

      add([

        // projectile setup

      ]);

    }

    // shoot controls



    // CAMERA

    // camera follow



    // TIMER & JOYSTICK (ANALOG) MOVEMENT

    onUpdate(() => {

      // movement logic

      // dt() gives the elapsed seconds since the last frame.
      timeLeft = Math.max(0, timeLeft - dt());
      timer.text = "Time: " + Math.ceil(timeLeft);

      if (hitSlime) {
        go("lose");
      } else if (gameScore >= 5) {
        go("win")
      } else if (timeLeft === 0) {
        go("lose", "Time ran out!");
      }
    });



    // COLLISIONS

    player.onCollide("collectible", (item) => {
      destroy(item);
      gameScore += 1;
      scoreText.text = "Score: " + gameScore;
      play("pickup");
    });



    player.onCollide("enemy", () => {
      hitSlime = true;
    });



    onCollide("bullet", "enemy", (bullet, enemy) => {

      // projectile collision

    });



    // TRANSITION EFFECT

    const fade = add([

      // fade overlay

    ]);



    player.onCollide("levelExit", () => {

      // level transition

    });

  });



  // LVL 2 SCENE

  scene("level2", () => {

    setGravity(640);

    let facing = RIGHT;



    const scoreText = add([

      // score display

    ]);



    const timer = add([

      // timer display

    ]);



    const player = add([

      // player setup

    ]);



    const returnExit = add([

      // return exit

    ]);



    // PLATFORMS

    makePlatform(

      // floor platform

    );



    // random platforms



    // ENEMIES

    spawnEnemyWave();



    // enemy loop



    // COLLECTIBLES

    spawnCollectible();



    // collectible loop



    // CONTROLS

    // movement controls



    // PROJECTILES

    function shoot () {

      add([

        // projectile setup

      ]);

    }



    // COLLISIONS

    player.onCollide("collectible", (item) => {

      // collect logic

    });



    player.onCollide("enemy", () => {

      // lose logic

    });



    onCollide("bullet", "enemy", (bullet, enemy) => {

      // projectile collision

    });



    // CAMERA
    // camera scale

    // camera follow



    // TIMER + ANALOG MOVEMENT

    onUpdate(() => {

      // movement logic

      // timer logic

      // win check

      // lose check

    });



    player.onCollide("returnExit", () => {

      // return transition

    });

  });



  // WIN GAME SCENE

  scene("win", () => {
    add([
      text("You collected all five coins!\nPress Enter to play again.", { size: 24 }),
      pos(16, 16),
      color(32, 40, 35),
    ]);
    
    onKeyPress("enter", () => {
      gameScore = 0;
      go("level1");
    })
    
    onKeyPress("space", toggleMusic);
  });



  //LOSE GAME SCENE

  scene("lose", () => {
    add([
      text("The slime got you!\nPress Enter to try again.", { size: 24 }),
      pos(16, 16),
      color(32, 40, 35),
    ]);
    
    onKeyPress("enter", () => {
      gameScore = 0;
      go("level1");
    })
    
    onKeyPress("space", toggleMusic);
  });



  // START MUSIC ONCE LOADED

  function toggleMusic() {
    if (!bgm) {
      bgm = play("bgm", { loop: true, volume: 0.25 });
    } else {
      bgm.paused = !bgm.paused;
    }
  }

  // RESET GAME 

  go("level1");

});
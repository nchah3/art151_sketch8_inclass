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



  function spawnCollectible () {

    add([

      // collectible setup

    ]);

  }



  function spawnEnemy () {

    const enemy = add([

      // enemy setup

    ]);

    // enemy timer

  }



  function spawnEnemyWave () {

    // wave logic

  }



  // LVL 1 SCENE

  scene("level1", () => {

    setGravity(640);

    let facing = RIGHT;

    const scoreText = add([

      // score display

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

      spawnCollectible();

    }

    // collectible loop



    // ENEMIES

    spawnEnemyWave();

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

      // timer logic

      // win check

      // lose check

    });



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

      // win text

    ]);



    add([

      // restart text

    ]);



    onKeyPress("enter", () => {

      // reset variables

      // restart game

    });

  });



  //LOSE GAME SCENE

  scene("lose", () => {

    add([

      // lose text

    ]);



    add([

      // restart text

    ]);



    onKeyPress("enter", () => {

      // reset variables

      // restart game

    });

  });



  // START MUSIC ONCE LOADED

  onLoad(() => {

    // music start

  });



  onKeyPress("space", () => {

    // music toggle

  });



  // RESET GAME 

  go("level1");

});
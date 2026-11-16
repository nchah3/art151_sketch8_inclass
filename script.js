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

  loadSprite(
    "name",

    // sprite file

    {

      // sprite animation

    }
  );

  // idle sprite

  loadSprite(
    "name",

    // sprite file

    {

      // frame animation

    }
  );

  // enemy sprite

  loadSprite(
    "name",

    // enemy file
  );

  // collectible sprite

  loadSprite(
    "name",

    // collectible file
  );



  // AUDIO ASSETS

  loadSound(
    "name",

    // sound file
  );

  loadSound(
    "name",

    // sound file
  );

  loadMusic(
    "name",

    // music file
  );



  // HELPERS

  function playSoundEffect () {

    // sound logic

  }



  function makePlatform (x, y, w, colorValue) {

    add([

      // platform setup

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

      // player setup

    ]);



    // LEVEL EXIT

    const levelExit = add([

      // exit setup

    ]);



    // PLATFORMS

    makePlatform(

      // floor platform

    );



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

      // move right

    });



    onButtonDown("moveLeft", () => {

      // move left

    });



    onButtonDown("moveUp", () => {

      // jump logic

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
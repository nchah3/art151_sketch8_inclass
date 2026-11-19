//SKETCH 8
//COMPLETED BY: Nihal Chahal
///DATE: 11/18/2026
// Based on the instructor-provided sketch 8 starter project

// All the code shown here was written using the official KAPLAY documentation and API references.
// I completed and extended the starter into a two-level knight coin-collection game. Official KAPALY and JavaScript documentation is linked beside the relvant code.

// NETNET: nn.on("load", callback) registers code for the page load event.
// Netnet library: https://github.com/netizenorg/netnet-standard-library

nn.on("load", () => {

  // KAPLAY SETUP

  // kaplay({...}) initializes the game with the settings in this object.
  // https://kaplayjs.com/docs/api/KAPLAYOpt/
  kaplay({

    // button setup

    // buttons maps action names such as moveRight to keyboard/gamepad inputs.
    // https://kaplayjs.com/docs/api/KAPLAYOpt/
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
    background:[211,211,211],

    // background settings
    // https://kaplayjs.com/docs/api/
    // crisp disables smoothing so pixel graphics keep sharp edges.
    // https://kaplayjs.com/docs/api/KAPLAYOpt/
    crisp: true,

  });
  


  
  // GLOBAL VARIABLES


  const SPEED = 120;
  const JUMP_FORCE = 500;
  const DEADZONE = 0.15;

  let soundEffect;
  let isPlaying = false;
  let bgm;

  let timeLeft = 60;
  let gameScore = 0;

  let spawnSide = "left";
  let currentLevel = 1;
  let collectedCoins = [[], []];




  // SPRITES

  // player sprite

  // loadSprite names an image asset; sliceX/sliceY split this sheet into 4 by 4 frames.
  // https://kaplayjs.com/docs/api/ctx/loadSprite/
  loadSprite("knight", "assets/knight_walk.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
      walkUp: { from: 0, to: 3, loop: true },
      walkLeft: { from: 4, to: 7, loop: true },
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

  // loadSound assigns a name to audio asset for later playback.
  // https://kaplayjs.com/docs/api/ctx/loadSound/
  loadSound("pickup", "assets/coin_pickup.wav");

  loadSound("jump", "assets/jump.wav");
  
  loadSound("bgm", "assets/background_music.ogg");



  // HELPERS

  function playSoundEffect () {

    // sound logic
    if (soundEffect) {
      
      // stop() stops the previously playing sound handle.
      // it is know as a different method from the sprite animation used below.
      // https://kaplayjs.com/docs/api/AudioPlay/
      soundEffect.stop();
    }
    
    // play starts the audio, while volume and speed control its playback.
    // https://kaplayjs.com/docs/api/ctx/play/
    soundEffect = play("jump", { volume: 0.3, speed: 1.8 });

  }


  // add([...]) builds a game object from components and returns the object.
  // String entries such as "platform" are tags used by queries and collision handlers.
  // https://kaplayjs.com/docs/api/ctx/add/
  function makePlatform (x, y, w, colorValue) {

    add([
      rect(w, 32),
      pos(x, y),
      color(colorValue),
      // area supplies a collision shape. body adds physics and solid-body behavior.
      // https://kaplayjs.com/docs/api/ctx/area/
      // https://kaplayjs.com/docs/api/ctx/body/
      area(),
      // isStatic keeps this platform body stationary during physics simulation.
      // This differs from fixed(), which controls how drawing follows the camera.
      // https://kaplayjs.com/docs/api/BodyComp/
      body({ isStatic: true }),
      "platform",
    ]);
  }


  // Values after = in parameters are defaults used for omitted/undefined arguments.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
  function spawnCollectible(x = width() / 2, y = height() - 56, coinId = 0) {
    if (collectedCoins[currentLevel - 1].includes(coinId)) {
      return;
    }
    add([
      sprite("gold coin"),
      pos(x, y),
      scale(3),
      area(),
      "collectible",
      // A plain object in the component list adds custom properties to the game object.
      // coinId tracks the coin; startY keeps its original height for the bobbing calculation.
      // https://kaplayjs.com/docs/api/ctx/add/
      { coinId: coinId, startY: y },
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

    // An object onUpdate callback runs each frame while the object is active.
    // The global onUpdate("collectible", ...) form below targets objects by tag.
    // https://kaplayjs.com/docs/api/GameObjRaw/
    // https://kaplayjs.com/docs/api/ctx/onUpdate/
    enemy.onUpdate(() => {
      // object.move(xSpeed, ySpeed) moves at a speed measured in pixels per second.
      // Here direction is -1 for left or 1 for right; pos() supplies this move method.
      // https://kaplayjs.com/docs/api/PosComp/
      enemy.move(60 * direction, 0);
           
      if (enemy.pos.x <= leftEdge) {
        enemy.pos.x = leftEdge;
        direction = 1;
      } else if (enemy.pos.x >= rightEdge) {
        enemy.pos.x = rightEdge;
        direction = -1;
      }
    });

    return enemy;
  }



  function spawnEnemyWave () {

    // wave logic
    // get("enemy") returns objects with that tag, while .length counts them.
    // The check caps the active enemy count at two.
    // https://kaplayjs.com/docs/api/ctx/get/
    if (get("enemy").length >= 2) {
      return;
    }
    const enemy = spawnEnemy();
    if (spawnSide === "left") {
      enemy.pos.x = width() * 0.6;
    }
    // && checks the distance only if player exists; Math.abs removes the sign.
    // The absolute x-distance is used to reject an enemy spawned too close to the player.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
    spawnSide = spawnSide === "left" ? "right" : "left";

    const player = get("player")[0];
    if (player && Math.abs(enemy.pos.x - player.pos.x) < 96) {
      // destroy removes the supplied game object from the scene.
      // https://kaplayjs.com/docs/api/ctx/destroy/
      destroy(enemy);
    }

  }


  
  // LVL 1 SCENE

  // scene registers a named scene. go(name) switches to a registered scene.
  // Registering the scene does not itself start it.
  // https://kaplayjs.com/docs/api/ctx/scene/
  // https://kaplayjs.com/docs/api/ctx/go/
  scene("level1", () => {
    // onKeyPress runs a callback for a new key press.
    // toggleMusic is passed as a function to call when space is pressed.
    // https://kaplayjs.com/docs/api/ctx/onKeyPress/
    onKeyPress("space", toggleMusic);
    currentLevel = 1;

    setGravity(640);

    let facing = RIGHT;
    let hitSlime = false;
    let changingLevel = false;

    const scoreText = add([
      // fixed keeps this score display independent of the camera transform.
      // It is also used later for the timer and fade overlay.
      // https://kaplayjs.com/docs/api/ctx/fixed/
      text("Score: " + gameScore, { size: 24 }),
      pos(16, 16),
      color(32, 40, 35),
      fixed(),
    ]);

    const timer = add([
      // Math.ceil rounds up so the displayed remaining time is a whole number.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
      text("Time: " + Math.ceil(timeLeft), { size: 24 }),
      pos(16, 48),
      color(32, 40, 35),
      fixed(),
    ]);



    const player = add([
      sprite("knight", { frame: 8 }),
      pos(0, 900),
      scale(3),
      area(),
      body(),
      "player",
    ]);
    


    // LEVEL EXIT

    const levelExit = add([

      // exit setup
      rect(32, 64),
      pos(width() - 48, height() - 96),
      color(140, 140, 140),
      area(),
      "levelExit",

    ]);



    // PLATFORMS

    makePlatform(0, height() - 32, width(), rgb(76, 96, 79));
    
    // Math.min selects the smaller input. These calculations limit platform size
    // and spacing using the game dimensions. Math.max below selects the larger input.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
    const platformWidth = Math.min(100, width() / 5);
    const platformSpacing = Math.min(140, width() / 4);
    const platformRise = Math.min(80, height() / 6);

    for (let i = 0; i < 3; i++) {
      const x = Math.min(width() - platformWidth - 56, width() / 4 + i * platformSpacing);
      const y = height() - 32 - (i + 1) * platformRise;
      makePlatform(x, y, platformWidth, rgb(108, 133, 99));
      spawnCollectible(x + platformWidth / 2 - 10, y - 24, i);
    }



    // COLLECTIBLES

    // Two floor coins complete the five-coin goal.
    spawnCollectible(width() / 10, height() - 56, 3);
    
    const lastPlatformX = width() / 4 + 2 * platformSpacing;
    const finalCoinX = Math.min(width() - 64, lastPlatformX + platformWidth + 96);
    spawnCollectible(finalCoinX, height() - 56, 4);

    // collectible loop
    // This onUpdate form calls the function for each object tagged collectible.
    // https://kaplayjs.com/docs/api/ctx/onUpdate/
    onUpdate("collectible", (item) => {
      // time() supplies elapsed time; JavaScript Math.sin creates a repeating wave.
      // Adding that wave to startY makes the coin bob by up to 2 pixels each way.
      // https://kaplayjs.com/docs/api/ctx/time/
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
      item.pos.y = item.startY + Math.sin(time() * 3) * 2;
    });



    // ENEMIES

    spawnEnemyWave();

    // enemy loop
    loop(8, () => {
      if (!changingLevel) {
        spawnEnemyWave();
      }
    });



    // CONTROLS

    // onButtonDown runs while a bound action is held. isButtonDown checks to see if the button is pressed, it should do the action it is assigned.
    // https://kaplayjs.com/docs/api/ctx/onButtonDown/
    // https://kaplayjs.com/docs/api/ctx/isButtonDown/
    onButtonDown("moveRight", () => {
      if (!changingLevel && !isButtonDown("moveLeft")) {
        player.move(SPEED, 0);
      }
    });



    onButtonDown("moveLeft", () => {
      if (!changingLevel && !isButtonDown("moveRight")) {
        player.move(-SPEED, 0);
      }
    });



    onButtonPress("moveUp", () => {
      if (!changingLevel && player.isGrounded()) {
        // body() supplies isGrounded() and jump() commands, grounded means supported by a platform.
        // !changingLevel basically means blocking the jum during a scene transition between the levels.
        // https://kaplayjs.com/docs/api/BodyComp/
        player.jump(JUMP_FORCE);
        play("jump");
      }
    });



    onButtonDown("moveDown", () => {

      // move down
      if (!changingLevel && !player.isGrounded()) {
        // body() exposes velocity as player.vel, positive y is down in this game.
        // Math.max makes the downward speed at 280 while this input is active.
        // https://kaplayjs.com/docs/api/BodyComp/
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
        player.vel.y = Math.max(player.vel.y, 280);
      }

    });


    // CAMERA

    // camera follow
    onUpdate(() => {
      // setCamPos sets the camera center, this x calculation follows the player midpoint.
      // https://kaplayjs.com/docs/api/ctx/setCamPos/
      setCamPos(player.pos.x + player.width * player.scale.x / 2, height() / 2);
    });



    // TIMER & JOYSTICK (ANALOG) MOVEMENT

    onUpdate(() => {
      if (changingLevel) {
        return;
      }
      
      let movingLeft = isButtonDown("moveLeft");
      let movingRight = isButtonDown("moveRight");

      // The left stick moves the player when no direction button is held.
      // getGamepads lists all recognized connected controllers onto pc
      // it is not a direct call to navigator.getGamepads().
      // https://kaplayjs.com/docs/api/ctx/getGamepads/
      const gamepads = getGamepads();
      if (!movingLeft && !movingRight && gamepads.length > 0) {
        const stick = gamepads[0].getStick("left");
        movingLeft = stick.x < -DEADZONE;
        movingRight = stick.x > DEADZONE;
        if (movingLeft || movingRight) {
          player.move(stick.x * SPEED, 0);
        }
      }
      
      // Stand still when neither direction, or both directions, are held.
      if (movingLeft === movingRight) {
        // player.stop() only stops the sprite animation, everything else still moves.
        // https://kaplayjs.com/docs/api/SpriteComp/
        player.stop();
        player.frame = facing.x < 0 ? 4: 8;
      } else {
        facing = movingLeft ? LEFT : RIGHT;
        
        const animation = movingLeft ? "walkLeft" : "walkRight";
        
        // Start each walk once so its frames can keep playing.
        // sprite.getCurAnim(): returns animation data and starts the named animation.
        // ?. safely reads name when getCurAnim() returns null.
        // This comparison avoids starting the same animation on every frame.
        // https://kaplayjs.com/docs/api/SpriteComp/
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
        if (player.getCurAnim()?.name !== animation) {
          player.play(animation);
        }
      }
      // Keeping the player inside the left and right edges
      const rightEdge = Math.max(0, width() - player.width * player.scale.x);
      // clamp(value, minimum, maximum) limits x to the permitted horizontal range.
      // https://kaplayjs.com/docs/api/ctx/clamp/
      player.pos.x = clamp(player.pos.x, 0, rightEdge);
      if (player.pos.y < 0) {
        player.pos.y = 0;
        player.vel.y = Math.max(0, player.vel.y);
      }
      
      // dt() gives the elapsed seconds since the last frame.
      // dt() is the elapsed frame time in seconds, so the timer tracks elapsed time.
      // Math.max keeps the remaining time from becoming negative.
      // https://kaplayjs.com/docs/api/ctx/dt/
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
      timeLeft = Math.max(0, timeLeft - dt());
      timer.text = "Time: " + Math.ceil(timeLeft);

      if (hitSlime) {
        go("lose");
      } else if (timeLeft === 0) {
        go("timeup");
      }
      if (gameScore >= 5) {
        levelExit.color = rgb(70, 180, 100);
      }
    });



    // COLLISIONS

    // area() supplies object.onCollide(tag, callback) for collision-start events.
    // callback recieves the other object, calls the item here
    // https://kaplayjs.com/docs/api/AreaComp/
    player.onCollide("collectible", (item) => {
      // exists() checks whether the object is still in the scene.
      // This guard skips collection during a transition or after removal
      // https://kaplayjs.com/docs/api/GameObjRaw/
      if (changingLevel || !item.exists()) {
        return;
      }
      // push appends this coin ID to the level 1 array. Level 2 uses index 1
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
      collectedCoins[0].push(item.coinId);
      destroy(item);
      gameScore += 1;
      scoreText.text = "Score: " + gameScore;
      play("pickup");
    });



    player.onCollide("enemy", () => {
      hitSlime = true;
    });


    // this global variable listens for collisions between different tags
    // Both participating objects need collision areas for this to work.
    // https://kaplayjs.com/docs/api/ctx/onCollide/
    onCollide("bullet", "enemy", (bullet, enemy) => {

      // projectile collision
      if (bullet.exists() && enemy.exists()) {
        destroy(bullet);
        destroy(enemy);
      }

    });

    onCollide("bullet", "platform", (bullet) => {
      destroy(bullet);
    });



    // TRANSITION EFFECT
    
    // opacity controls transparancy. fixed keeps the overlay align with the screen.
    // z(100) draws the overlay above the objects with a lower z on the same layer.
    // https://kaplayjs.com/docs/api/ctx/opacity/
    // https://kaplayjs.com/docs/api/ctx/fixed/
    // https://kaplayjs.com/docs/api/ctx/z/
    const fade = add([

      // fade overlay
      rect(width(), height()),
      pos(0, 0),
      color(0, 0, 0),
      opacity(0),
      fixed(),
      z(100),

    ]);


    // onCollideUpdate checks each frame while the player touches the tagged exit
    // changingLevel flag prevents starting the transition repeatedly.
    // https://kaplayjs.com/docs/api/AreaComp/
    player.onCollideUpdate("levelExit", () => {

      // level transition
      if (gameScore < 5 || changingLevel || hitSlime || timeLeft <= 0) {
        return;
      }
      changingLevel = true;
      // tween changes a value from 0 to 1 over 0.25 seconds to fade the overlay.
      // its controller inherits onEnd from TimerController and the callback changes scenes afterward.
      // https://kaplayjs.com/docs/api/ctx/tween/
      // https://kaplayjs.com/docs/api/TweenController/
      // https://kaplayjs.com/docs/api/TimerController/
      tween(0, 1, 0.25, (value) => {
        fade.opacity = value;
      }).onEnd(() => { go("level2"); });

    });

  });



  // LVL 2 SCENE

  scene("level2", () => {
    onKeyPress("space", toggleMusic);
    currentLevel = 2;

    setGravity(640);

    let facing = RIGHT;
    let hitSlime = false;
    let changingLevel = false;



    const scoreText = add([

      // score display
      text("Score: " + gameScore, { size: 24 }),
      pos(16, 16),
      color(32, 40, 35),
      fixed(),

    ]);



    const timer = add([

      // timer display
      text("Time: " + Math.ceil(timeLeft), { size: 24 }),
      pos(16, 48),
      color(32, 40, 35),
      fixed(),

    ]);



    const player = add([

      // player setup
      sprite("knight", { frame: 8 }),
      pos(80, 900),
      scale(3),
      area(),
      body(),
      "player",

    ]);



    const returnExit = add([

      // return exit
      rect(24, 64),
      pos(16, height() - 96),
      color(70, 130, 190),
      area(),
      "returnExit",

    ]);



    // PLATFORMS

    makePlatform(

      // floor platform
      0, height() - 32, width(), rgb(76, 96, 79)

    );



    // random platforms
    const platformWidth = Math.min(100, width() / 5);
    const platformSpacing = Math.min(140, width() / 4);
    const platformRise = Math.min(80, height() / 6);
    for (let i = 0; i < 3; i++) {
      const x = width() - width() / 4 - platformWidth - i * platformSpacing;
      const y = height() - 32 - (i + 1) * platformRise - rand(0, 4);
      makePlatform(x, y, platformWidth, rgb(108, 133, 99));
      spawnCollectible(x + platformWidth / 2 - 10, y - 24, i);
    }



    // ENEMIES

    spawnEnemyWave();



    // enemy loop
    loop(6, () => {
      if (!changingLevel) {
        spawnEnemyWave();
      }
    });



    // COLLECTIBLES

    spawnCollectible(width() - 80, height() - 56, 3);
    spawnCollectible(width() - 40, height() - 56, 4);



    // collectible loop
    onUpdate("collectible", (item) => {
      item.pos.y = item.startY + Math.sin(time() * 3) * 2;
    });



    // CONTROLS

    // movement controls
    onButtonDown("moveRight", () => {
      if (!changingLevel && !isButtonDown("moveLeft")) {
        player.move(SPEED, 0);
      }
    });
    onButtonDown("moveLeft", () => {
      if (!changingLevel && !isButtonDown("moveRight")) {
        player.move(-SPEED, 0);
      }
    });
    onButtonPress("moveUp", () => {
      if (!changingLevel && player.isGrounded()) {
        player.jump(JUMP_FORCE);
        play("jump");
      }
    });
    onButtonDown("moveDown", () => {
      if (!changingLevel && !player.isGrounded()) {
        player.vel.y = Math.max(player.vel.y, 280);
      }
    });



    // COLLISIONS

    player.onCollide("collectible", (item) => {

      // collect logic
      if (changingLevel || !item.exists()) {
        return;
      }
      collectedCoins[1].push(item.coinId);
      destroy(item);
      gameScore += 1;
      scoreText.text = "Score: " + gameScore;
      play("pickup");

    });



    player.onCollide("enemy", () => {

      // lose logic
      hitSlime = true;

    });



    onCollide("bullet", "enemy", (bullet, enemy) => {

      // projectile collision
      if (bullet.exists() && enemy.exists()) {
        destroy(bullet);
        destroy(enemy);
      }

    });

    onCollide("bullet", "platform", (bullet) => {
      destroy(bullet);
    });
 


    // CAMERA
    // camera scale
    // sets camera zoom to its normal scale.
    // https://kaplayjs.com/docs/api/ctx/setCamScale/
    setCamScale(1);

    // camera follow
    onUpdate(() => {
      setCamPos(player.pos.x + player.width * player.scale.x / 2, height() / 2);
    });



    // TIMER + ANALOG MOVEMENT

    onUpdate(() => {

      // movement logic
      if (changingLevel) {
        return;
      }
      let movingLeft = isButtonDown("moveLeft");
      let movingRight = isButtonDown("moveRight");
      const gamepads = getGamepads();
      if (!movingLeft && !movingRight && gamepads.length > 0) {
        const stick = gamepads[0].getStick("left");
        movingLeft = stick.x < -DEADZONE;
        movingRight = stick.x > DEADZONE;
        if (movingLeft || movingRight) {
          player.move(stick.x * SPEED, 0);
        }
      }
      if (movingLeft === movingRight) {
        player.stop();
        player.frame = facing.x < 0 ? 4 : 8;
      } else {
        facing = movingLeft ? LEFT : RIGHT;
        const animation = movingLeft ? "walkLeft" : "walkRight";
        if (player.getCurAnim()?.name !== animation) {
          player.play(animation);
        }
      }
      const rightEdge = Math.max(0, width() - player.width * player.scale.x);
      player.pos.x = clamp(player.pos.x, 0, rightEdge);
      if (player.pos.y < 0) {
        player.pos.y = 0;
        player.vel.y = Math.max(0, player.vel.y);
      }

      // timer logic
      timeLeft = Math.max(0, timeLeft - dt());
      timer.text = "Time: " + Math.ceil(timeLeft);

      // win check
      if (gameScore >= 10 && !hitSlime && timeLeft > 0) {
        go("win");
      }

      // lose check
      else if (hitSlime) {
        go("lose");
      } else if (timeLeft === 0) {
        go("timeup");
      }

    });



    player.onCollideUpdate("returnExit", () => {

      // return transition
      if (changingLevel || hitSlime || timeLeft <= 0) {
        return;
      }
      changingLevel = true;
      const fade = add([
        rect(width(), height()),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0),
        fixed(),
        z(100),
      ]);
      tween(0, 1, 0.25, (value) => {
        fade.opacity = value;
      }).onEnd(() => { go("level1"); });

    });

  });
   


  // WIN GAME SCENE

  scene("win", () => {
    add([
      text("You collected all ten coins!\nPress Enter to play again.", { size: 24 }),
      pos(16, 16),
      color(32, 40, 35),
    ]);
    
    onKeyPress("enter", () => {
      gameScore = 0;
      timeLeft = 60;
      collectedCoins = [[], []];
      spawnSide = "left";
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
      timeLeft = 60;
      collectedCoins = [[], []];
      spawnSide = "left";
      go("level1");
    })
    
    onKeyPress("space", toggleMusic);
  });

  // TIMER END SCENE
  
  scene("timeup", () => {
    add([
      text("Time ran out!\nPress Enter to try again.", { size: 24 }),
      pos(16, 16),
      color(32, 40, 35),
    ]);
    
    onKeyPress("enter", () => {
      gameScore = 0;
      timeLeft = 60;
      collectedCoins = [[], []];
      spawnSide = "left";
      go("level1");
    });
    
    onKeyPress("space", toggleMusic);
  });


  // START MUSIC ONCE LOADED

  function toggleMusic() {
  if (!bgm) {
    bgm = play("bgm", {
      loop: true,
      volume: 0.25,
    });
  } else {
    bgm.paused = !bgm.paused;
  }
}

  // RESET GAME 

  go("level1");

});

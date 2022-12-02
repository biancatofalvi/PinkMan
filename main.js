import Phaser from "phaser";

//global variables
let player;
let platform1;
let platform2;
let cursors;
let pineapple;
let score;
let scoreText;
let audio_jump;
let audio_collect;
let audio_congrats;
let audio_best;


const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300},
      debug: false
    }
  },
  scene: {

    preload() {
      //background
      this.load.image('background1', './assets/backgrounds/background1.png')
      this.load.image('background2', './assets/backgrounds/background2.png')
      this.load.image('background3', './assets/backgrounds/background3.png')
      this.load.image('cloud1', './assets/backgrounds/cloud1.png')
      this.load.image('cloud2', './assets/backgrounds/cloud2.png')
      this.load.image('cloud3', './assets/backgrounds/cloud3.png')
      this.load.image('cloud4', './assets/backgrounds/cloud4.png')
      this.load.image('cloud5', './assets/backgrounds/cloud5.png')
      this.load.image('cloud6', './assets/backgrounds/cloud6.png')
      this.load.image('cloud7', './assets/backgrounds/cloud7.png')
      this.load.image('cloud8', './assets/backgrounds/cloud8.png')

      //platforms
      this.load.image('platform1', './assets/platforms/ground.png')
      this.load.image('platform2', './assets/platforms/platform.png')

      //character
      this.load.spritesheet('pinkMan', './assets/character/idle.png', {
        frameWidth: 32,
        frameHeight: 32
      })

      this.load.spritesheet('run', './assets/character/run.png', {
        frameWidth: 32,
        frameHeight: 32
      })

      this.load.spritesheet('jump', './assets/character/jump.png', {
        frameWidth: 32,
        frameHeight: 32
      })

      //cursors
      cursors = this.input.keyboard.createCursorKeys()

      //items
      this.load.spritesheet('dance', './assets/items/pineapple.png', {
        frameWidth: 32,
        frameHeight: 32
      })

      //audio
      this.load.audio('jump', './assets/audio/jump.wav')
      this.load.audio('collect', './assets/audio/collect.wav')
      this.load.audio('congrats', './assets/audio/congrats.wav')
      this.load.audio('best', './assets/audio/best.wav')

    },



    create () {
      //background
      this.add.image(300, 300, 'background1')
      this.add.image(300, 300, 'background2')
      this.add.image(300, 300, 'background3')
      this.add.image(100, 100, 'cloud1')
      this.add.image(100, 100, 'cloud2')
      this.add.image(100, 100, 'cloud3')
      this.add.image(100, 100, 'cloud4')
      this.add.image(300, 100, 'cloud5')
      this.add.image(500, 100, 'cloud6')
      this.add.image(500, 100, 'cloud7')
      this.add.image(500, 100, 'cloud8')

      //platforms
      platform1 = this.physics.add.staticGroup()
      platform1.create(300, 580, "platform1").setScale(0.65).refreshBody()

      platform2 = this.physics.add.staticGroup()
      platform2.create(360, 200, "platform2").setScale(1.5).refreshBody()
      platform2.create(300, 400, "platform2").setScale(1.5)
      platform2.create(150, 300, "platform2").setScale(1.5)
      platform2.create(100, 500, "platform2").setScale(1.5)
      platform2.create(500, 450, "platform2").setScale(1.5)

      //character
      player = this.physics.add.sprite(200, 400, 'pinkMan')
      player.setBounce(0.5)
      player.setCollideWorldBounds(true)


      //collision between platforms and character
      this.physics.add.collider(player, platform1)
      this.physics.add.collider(player, platform2)

      //audio
      audio_jump = this.sound.add('jump')
      audio_collect = this.sound.add('collect')
      audio_congrats = this.sound.add('congrats')
      audio_best = this.sound.add('best')

      //character movements
      this.anims.create({
        key: 'pinkMan',
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNames('pinkMan', { start: 1, end: 11}),
      })

      this.anims.create({
        key: 'right',
        frameRate: 35,
        repeat: -1,
        frames: this.anims.generateFrameNames('run', { start: 1, end: 11}),
      })

      this.anims.create({
        key: 'left',
        frameRate: 35,
        repeat: -1,
        frames: this.anims.generateFrameNames('run', { start: 1, end: 11}),
      })

      this.anims.create({
        key: 'jump',
        frameRate: 20,
        repeat: -1,
        frames: this.anims.generateFrameNames('jump', { start: 1, end: 6}),
      })

      //items
      pineapple = this.physics.add.group({
          key: 'dance',
          repeat: 11,
          setXY: { x: 12, y: 0, stepX: 50 }
      })

      pineapple.children.iterate(function (child) {

          child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6));

      })

      //collision between platforms and items
      this.physics.add.collider(pineapple, platform1);
      this.physics.add.collider(pineapple, platform2);

      //check overlap between character and pineapple
      this.physics.add.overlap(player, pineapple, collectPineapple, null, this);

      //NOT FINISHED pineapple dance
      this.anims.create({
        key: 'dance',
        frameRate: 10,
        repeat: -1,
        frames: this.anims.generateFrameNames('dance', { start: 1, end: 17}),
      })

      //adding score in the top left corner
      scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#008B8B' });

      //give score initial value of 0
      score = 0

      //collect pineapple and rise score
      function collectPineapple (player, pineapple) {
          pineapple.disableBody(true, true);

          score += 10;
          audio_collect.play()
          scoreText.setText('Score: ' + score);

      }


    },




    update () {
      //character movement
      if (cursors.right.isDown) {
        player.setVelocityX(290)
        player.flipX = false
        player.anims.play('right', true)
      } else if (cursors.left.isDown) {
        player.setVelocityX(-290)
        player.flipX = true
        player.anims.play('left', true)
      } else if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-300)
        player.anims.play('jump', true)
        audio_jump.play()
      } else {
        player.setVelocityX(0)
        player.anims.play('pinkMan', true)

      }

      //score
      if (score === 120) {
        audio_congrats.play()
        alert("Congrats! You won the game!")
      }


      if (score === 0) {
        audio_best.loop = false
        audio_best.play()
      }

    }

  }
})

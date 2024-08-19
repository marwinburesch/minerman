import { Scene } from "phaser";

export class Level extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("Level");
  }

  preload() {
    this.load.tilemapTiledJSON("level1", "src/maps/level1.json");
    this.load.image("tiles", "assets/tiles.png");
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    const map = this.make.tilemap({ key: "level1" });
    const tileset = map.addTilesetImage("tileset", "tiles");
    const groundLayer = map.createLayer("Ground", tileset.name, 0, 0);

    this.player = this.physics.add.sprite(50, 50, "player");

    // Add collision between player and groundLayer
    this.physics.add.collider(this.player, groundLayer);

    // Add enemies, bombs, and other game objects here

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }
  }
}

import { addComponent, addEntity, createWorld, IWorld, System } from "bitecs";
import { Scene } from "phaser";
import Position from "../components/Position";
import Sprite from "../components/Sprite";
import Velocity from "../components/Velocity";
import { createSpriteSystem } from "../systems/SpriteSystem";
import createMovementSystem from "../systems/MovementSystem";
import Player from "../components/Player";
import createPlayerSystem from "../systems/PlayerSystem";

export class Game extends Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private world?: IWorld;
  private spriteSystem?: System;
  private movementSystem?: System;
  private playerSystem?: System;

  constructor() {
    super("Game");
  }

  init() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  preload() {
    this.load.image("miner", "assets/character/idle-front.png");
    this.load.image("bat", "assets/enemies/bat/fly-front.png");
  }

  create() {
    this.world = createWorld();
    const miner = addEntity(this.world);
    const bat = addEntity(this.world);

    addComponent(this.world, Position, miner);
    Position.x[miner] = 100;
    Position.y[miner] = 100;
    addComponent(this.world, Position, bat);
    Position.x[bat] = 200;
    Position.y[bat] = 200;

    addComponent(this.world, Velocity, miner);
    addComponent(this.world, Velocity, bat);
    Velocity.x[bat] = 5;
    Velocity.y[bat] = 5;

    addComponent(this.world, Sprite, miner);
    Sprite.texture[miner] = 0;
    addComponent(this.world, Sprite, bat);
    Sprite.texture[bat] = 1;

    addComponent(this.world, Player, miner);

    this.spriteSystem = createSpriteSystem(this, ["miner", "bat"]);
    this.movementSystem = createMovementSystem();
    this.playerSystem = createPlayerSystem(this.cursors);
  }

  update(t: number, dt: number): void {
    if (!this.world || !this.spriteSystem) {
      return;
    }
    this.playerSystem?.(this.world);
    this.movementSystem?.(this.world);
    this.spriteSystem(this.world);
  }
}

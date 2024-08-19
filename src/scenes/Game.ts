import { Scene } from "phaser";
import {
  createWorld,
  addEntity,
  addComponent,
  defineComponent,
  defineSystem,
  defineQuery,
  enterQuery,
  System,
  IWorld,
  Types,
  exitQuery,
} from "bitecs";

const Position = defineComponent({
  x: Types.f32,
  y: Types.f32,
});

const Velocity = defineComponent({
  x: Types.f32,
  y: Types.f32,
});

const Sprite = defineComponent({
  texture: Types.ui8,
});

const spritesById = new Map<number, Phaser.GameObjects.Sprite>();
const spriteQuery = defineQuery([Sprite, Position]);
const spriteQueryEnter = enterQuery(spriteQuery);
const spriteQueryExit = exitQuery(spriteQuery);
const createSpriteSystem = (scene: Scene, textures: string[]) => {
  return defineSystem((world) => {
    const enterEntities = spriteQueryEnter(world);
    for (let i = 0; i < enterEntities.length; i++) {
      const id = enterEntities[i];
      const texId = Sprite.texture[id];
      const texture = textures[texId];
      spritesById.set(id, scene.add.sprite(0, 0, texture));
    }
    const entities = spriteQuery(world);
    for (let i = 0; i < entities.length; i++) {
      const id = entities[i];
      const sprite = spritesById.get(id);
      if (!sprite) {
        continue;
      }
      sprite.x = Position.x[id];
      sprite.y = Position.y[id];
    }

    const exitEntities = spriteQueryExit(world);
    for (let i = 0; i < exitEntities.length; i++) {
      const id = exitEntities[i];
      const sprite = spritesById.get(id);
      if (!sprite) {
        continue;
      }
      sprite.destroy();
      spritesById.delete(id);
    }

    return world;
  });
};

export class Game extends Scene {
  private world?: IWorld;
  private spriteSystem?: System;

  constructor() {
    super("Game");
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
    Velocity.x[miner] = 5;
    Velocity.y[miner] = 5;
    addComponent(this.world, Velocity, bat);
    Velocity.x[bat] = 5;
    Velocity.y[bat] = 5;

    addComponent(this.world, Sprite, miner);
    Sprite.texture[miner] = 0;
    addComponent(this.world, Sprite, bat);
    Sprite.texture[bat] = 1;

    this.spriteSystem = createSpriteSystem(this, ["miner", "bat"]);
  }

  update(t: number, dt: number): void {
    if (!this.world || !this.spriteSystem) {
      return;
    }
    this.spriteSystem(this.world);
  }
}

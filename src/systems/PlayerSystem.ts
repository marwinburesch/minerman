import Phaser from "phaser";
import { defineQuery, defineSystem } from "bitecs";

import Player from "../components/Player";
import Velocity from "../components/Velocity";

export default function createPlayerSystem(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
) {
  const query = defineQuery([Player, Velocity]);
  return defineSystem((world) => {
    const entities = query(world);
    for (let i = 0; i < entities.length; i++) {
      const id = entities[i];
      // ←
      if (
        cursors.left.isDown &&
        !cursors.up.isDown &&
        !cursors.down.isDown &&
        !cursors.right.isDown
      ) {
        Velocity.x[id] = -5;
        Velocity.y[id] = 0;
      }
      // →
      else if (
        cursors.right.isDown &&
        !cursors.up.isDown &&
        !cursors.down.isDown &&
        !cursors.left.isDown
      ) {
        Velocity.x[id] = 5;
        Velocity.y[id] = 0;
      }
      // ↑
      else if (
        cursors.up.isDown &&
        !cursors.left.isDown &&
        !cursors.right.isDown &&
        !cursors.down.isDown
      ) {
        Velocity.x[id] = 0;
        Velocity.y[id] = -5;
      }
      // ↓
      else if (
        cursors.down.isDown &&
        !cursors.left.isDown &&
        !cursors.right.isDown &&
        !cursors.up.isDown
      ) {
        Velocity.x[id] = 0;
        Velocity.y[id] = 5;
      }
      // ↖
      else if (cursors.left.isDown && cursors.up.isDown) {
        Velocity.x[id] = -3.5;
        Velocity.y[id] = -3.5;
      }
      // ↙
      else if (cursors.left.isDown && cursors.down.isDown) {
        Velocity.x[id] = -3.5;
        Velocity.y[id] = 3.5;
      }
      // ↗
      else if (cursors.right.isDown && cursors.up.isDown) {
        Velocity.x[id] = 3.5;
        Velocity.y[id] = -3.5;
      }
      // ↘
      else if (cursors.right.isDown && cursors.down.isDown) {
        Velocity.x[id] = 3.5;
        Velocity.y[id] = 3.5;
      } else {
        Velocity.x[id] = 0;
        Velocity.y[id] = 0;
      }
    }

    return world;
  });
}

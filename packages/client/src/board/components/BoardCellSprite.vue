<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { Hitbox } from '@/utils/hitbox';
import type { CellViewModel } from '../models/cell.model';
import { config } from '@/utils/config';
import { useCamera } from '../composables/useCamera';

const { cell } = defineProps<{ cell: CellViewModel }>();

const sheet = useSpritesheet<'', 'tile'>(() => cell.spriteId);

const camera = useCamera();

const { w, h } = {
  w: config.TILE_SIZE.x,
  h: config.TILE_SIZE.y - config.TILE_SIZE.z
};
const { offsetW, offsetH } = {
  offsetW: -config.TILE_SIZE.x / 2,
  offsetH: -config.TILE_SIZE.z * 3.5
};
const hitArea = Hitbox.from(
  [
    [
      offsetW + w * 0,
      offsetH + h * (1 / 3),

      offsetW + w * 0.5,
      offsetH + h * 0,

      offsetW + w,
      offsetH + h * (1 / 3),

      offsetW + w,
      offsetH + h * (2 / 3),

      offsetW + w * 0.5,
      offsetH + h,

      offsetW + w * 0,
      offsetH + h * (2 / 3)
    ]
  ],
  { width: 96, height: 80 },
  {
    x: 0,
    y: 0
  }
);
</script>

<template>
  <animated-sprite
    v-if="sheet"
    :anchor="0.5"
    :hitArea="hitArea"
    :textures="sheet.sheets.base.tile.animations[0]"
  />
</template>

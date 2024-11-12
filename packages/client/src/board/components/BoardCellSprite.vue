<script setup lang="ts">
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { TERRAINS, type Terrain } from '@game/engine/src/board/board-utils';
import { Hitbox } from '@/utils/hitbox';
import type { CellViewModel } from '../models/cell.model';
import { config } from '@/utils/config';

const { cell } = defineProps<{ cell: CellViewModel }>();

const sheetsDict: Record<Terrain, string> = {
  [TERRAINS.GROUND]: 'grass',
  [TERRAINS.WATER]: 'water',
  [TERRAINS.EMPTY]: ''
};

const sheet = useSpritesheet<'', 'tile'>(() => sheetsDict[cell.terrain]);

const camera = useIsoCamera();

const { w, h } = { w: 96, h: 80 };
const { offsetW, offsetH } = {
  offsetW: -config.TILE_SIZE.x / 2,
  offsetH: -config.TILE_SIZE.z * 3
};
const hitArea = Hitbox.from(
  [
    [
      offsetW + w * 0,
      offsetH + h * 0.5,

      offsetW + w * 0.5,
      offsetH + h * 0.2,

      offsetW + w,
      offsetH + h * 0.5,

      offsetW + w,
      offsetH + h * 0.7,

      offsetW + w * 0.5,
      offsetH + h,

      offsetW + w * 0,
      offsetH + h * 0.7
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
  <AnimatedSprite
    v-if="sheet"
    :anchor="0.5"
    :hitArea="hitArea"
    :textures="sheet.sheets.base.tile.animations[camera.angle.value]"
  />
</template>

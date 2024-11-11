<script setup lang="ts">
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { TERRAINS, type Terrain } from '@game/engine/src/board/board-utils';
import { Hitbox } from '@/utils/hitbox';
import type { CellViewModel } from '../models/cell.model';

const { cell } = defineProps<{ cell: CellViewModel }>();

const sheetsDict: Record<Terrain, string> = {
  [TERRAINS.GROUND]: 'grass',
  [TERRAINS.WATER]: 'water',
  [TERRAINS.EMPTY]: ''
};

const sheet = useSpritesheet<'', 'tile'>(() => sheetsDict[cell.terrain]);

const camera = useIsoCamera();

const { w, h } = { w: 96, h: 80 };
const hitArea = Hitbox.from(
  [
    [
      w * 0,
      h * 0.5,

      w * 0.5,
      h * 0.2,

      w,
      h * 0.5,

      w,
      h * 0.7,

      w * 0.5,
      h,

      w * 0,
      h * 0.7
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
    :hitArea="hitArea"
    :textures="sheet.sheets.base.tile.animations[camera.angle.value]"
  />
</template>

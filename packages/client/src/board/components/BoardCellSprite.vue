<script setup lang="ts">
import { useIsoCamera } from '@/iso/composables/useIsoCamera';
import type { CellViewModel } from '@/pages/battle/battle.store';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { TERRAINS, type Terrain } from '@game/engine/src/board/board-utils';

const { cell } = defineProps<{ cell: CellViewModel }>();

const sheetsDict: Record<Terrain, string> = {
  [TERRAINS.GROUND]: 'grass',
  [TERRAINS.WATER]: 'water',
  [TERRAINS.EMPTY]: ''
};

const sheet = useSpritesheet<'', 'tile'>(() => sheetsDict[cell.terrain]);

const camera = useIsoCamera();
</script>

<template>
  <AnimatedSprite
    v-if="sheet"
    :textures="sheet.sheets.base.tile.animations[camera.angle.value]"
  />
</template>

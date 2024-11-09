<script setup lang="ts">
import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import type { CellViewModel } from '@/pages/battle/battle.store';
import { useAssets } from '@/shared/composables/useAssets';
import type { ParsedAsepriteSheet } from '@/utils/aseprite-parser';
import { config } from '@/utils/config';

const { cell } = defineProps<{ cell: CellViewModel }>();

const assets = useAssets();

const sheet = shallowRef<ParsedAsepriteSheet<'', 'tile'>>();
assets.loadSpritesheet<'', 'tile'>('grass').then(result => {
  sheet.value = result;
});
</script>

<template>
  <AnimatedIsoPoint :position="cell">
    <AnimatedSprite
      v-if="sheet"
      :textures="sheet.sheets.base.tile.animations[0]"
      :pivot="[0, config.TILE_SIZE.z]"
    />
  </AnimatedIsoPoint>
</template>

<style scoped lang="postcss"></style>

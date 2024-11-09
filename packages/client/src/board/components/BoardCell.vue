<script setup lang="ts">
import IsoPoint from '@/iso/components/IsoPoint.vue';
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
  <IsoPoint :position="cell">
    <AnimatedSprite
      v-if="sheet"
      :textures="sheet.sheets.base.tile.animations[0]"
      :pivot="[0, config.TILE_SIZE.z]"
    />
  </IsoPoint>
</template>

<style scoped lang="postcss"></style>

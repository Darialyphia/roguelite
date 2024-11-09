<script setup lang="ts">
import IsoPoint from '@/iso/components/IsoPoint.vue';
import type { CellViewModel } from '@/pages/battle/battle.store';
import { useAssets } from '@/shared/composables/useAssets';
const { cell } = defineProps<{ cell: CellViewModel }>();

const assets = useAssets();

assets.loadSpritesheet('grass').then(sheet => {
  console.log(sheet);
});
</script>

<template>
  <IsoPoint :position="cell">
    <graphics
      @render="
        g => {
          g.clear();
          g.beginFill('red');
          g.drawCircle(0, 0, 32);
          g.endFill();
        }
      "
    />
  </IsoPoint>
</template>

<style scoped lang="postcss"></style>

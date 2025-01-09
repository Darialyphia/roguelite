<script setup lang="ts">
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';

const ui = useBattleUiStore();
</script>

<template>
  <container
    :ref="
      (obj: any) => {
        ui.assignLayer(obj, 'ui');
      }
    "
  >
    <slot />
  </container>
</template>

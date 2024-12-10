<script setup lang="ts">
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import type { UnitViewModel } from '../unit.model';
import { useActiveUnit } from '@/pages/battle/battle.store';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';

const { unit } = defineProps<{ unit: UnitViewModel }>();
const ui = useBattleUiStore();

const activeUnit = useActiveUnit();
const isActive = computed(() => activeUnit.value?.equals(unit));
</script>

<template>
  <UiAnimatedSprite
    :ref="
      (obj: any) => {
        ui.assignLayer(obj, 'ui');
      }
    "
    v-if="isActive"
    assetId="active-unit-indicator"
    :y="-40"
  />
</template>

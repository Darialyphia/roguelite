<script setup lang="ts">
import type { UnitModifier } from '@game/engine/src/unit/unit-modifier.entity';
import type { UnitViewModel } from '../unit.model';

const { modifier } = defineProps<{
  modifier: UnitViewModel['modifiers'][number];
}>();
</script>

<template>
  <sprite
    v-if="modifier.iconId"
    :texture="`/assets/icons/${modifier.iconId}.png`"
    :anchor="0.5"
    event-mode="none"
    :scale="0.5"
    :y="-20"
  />
</template>

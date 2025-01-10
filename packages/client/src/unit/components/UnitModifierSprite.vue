<script setup lang="ts">
import type { UnitModifier } from '@game/engine/src/unit/unit-modifier.entity';

const { modifier } = defineProps<{ modifier: UnitModifier }>();
console.log(modifier);
</script>

<template>
  <sprite
    v-if="modifier.infos.iconId"
    :texture="`/assets/icons/${modifier.infos.iconId}.png`"
    :anchor="0.5"
    event-mode="none"
    :scale="0.5"
    :y="-20"
  />
</template>

<script setup lang="ts">
import { useUserPlayer } from '@/battle/stores/battle.store';
import type { UnitViewModel } from '../unit.model';
import VirtualFloatingCard from '@/ui/scenes/VirtualFloatingCard.vue';
import { useCamera } from '@/board/composables/useCamera';

const { modifier, unit, index } = defineProps<{
  unit: UnitViewModel;
  modifier: UnitViewModel['modifiers'][number];
  index: number;
}>();

const isHovered = ref(false);
const camera = useCamera();
const cardPosition = computed(() =>
  camera.viewport.value?.toScreen({
    x: unit.screenPosition.x + camera.offset.value.x - 40 + index * 10,
    y: unit.screenPosition.y + camera.offset.value.y - 50
  })
);
</script>

<template>
  <container
    v-if="modifier.iconId"
    :scale="0.5"
    :y="-20"
    :x="-20 + index * 10"
    event-mode="static"
    @pointerenter="isHovered = true"
    @pointerleave="isHovered = false"
  >
    <sprite :texture="`/assets/icons/${modifier.iconId}.png`" :anchor="0.5" />
    <VirtualFloatingCard
      :position="cardPosition!"
      :timeout="500"
      :is-opened="!!cardPosition && isHovered"
    >
      <div class="bg-black p-3 c-white">
        <div class="text-1 text-bold">{{ modifier.name }}</div>
        <p class="text-0">{{ modifier.description }}</p>
      </div>
    </VirtualFloatingCard>
    <!-- <sprite
      :texture="`/assets/icons/keyword-frame-${modifier.sourcePlayer.getPlayer().isAlly(userPlayer.getPlayer()) ? 'positive' : 'negative'}.png`"
      :anchor="0.5"
    /> -->
  </container>
</template>

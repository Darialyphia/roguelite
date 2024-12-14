<script setup lang="ts">
import { useUserPlayer } from '@/pages/battle/battle.store';
import type { PlayerViewModel } from '@/player/player.model';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import { config } from '@/utils/config';

const { obstacle } = defineProps<{
  obstacle: { name: string; spriteId: string; player: PlayerViewModel | null };
}>();

const userPlayer = useUserPlayer();

const tag = computed(() => {
  if (!obstacle.player) return 'idle';

  return userPlayer.value.getPlayer().equals(obstacle.player.getPlayer())
    ? 'ally'
    : 'enemy';
});
</script>

<template>
  <container>
    <UiAnimatedSprite
      :assetId="obstacle.spriteId"
      :y="-config.TILE_SIZE.y / 2"
      :tag="tag"
    />
  </container>
</template>

<style scoped lang="postcss"></style>

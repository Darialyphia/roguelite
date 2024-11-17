<script setup lang="ts">
import { PTransition } from 'vue3-pixi';
import { useMultiLayerTexture } from '@/shared/composables/useMultiLayerTexture';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { config } from '@/utils/config';

const { spriteId } = defineProps<{ spriteId: string }>();

const spritesheet = useSpritesheet(() => spriteId);

const textures = useMultiLayerTexture({
  sheet: spritesheet,
  parts: {},
  tag: 'default',
  dimensions: config.UNIT_SPRITE_SIZE
});
</script>

<template>
  <PTransition
    appear
    :duration="{ enter: 200, leave: 200 }"
    :before-enter="{ alpha: 0 }"
    :enter="{ alpha: 1 }"
    :leave="{ alpha: 0 }"
  >
    <animated-sprite
      v-if="textures.length"
      :textures="textures"
      :anchor="0.5"
      event-mode="none"
    />
  </PTransition>
</template>

<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core';
import { config } from '@/utils/config';
import {
  autoPlacement,
  autoUpdate,
  shift,
  useFloating
} from '@floating-ui/vue';
import type { Point } from '@game/shared';
import { useCamera } from '@/board/composables/useCamera';
import { External } from 'vue3-pixi';

const {
  position,
  timeout = 0,
  isOpened
} = defineProps<{
  position: Point;
  timeout?: number;
  isOpened: boolean;
}>();

const camera = useCamera();

const isDisplayed = ref(false);

const virtualEl = ref({
  getBoundingClientRect() {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 20,
      right: 20,
      width: 20,
      height: 20
    };
  }
});
const floating = useTemplateRef('floating');

const { x, y, strategy } = useFloating(virtualEl, floating, {
  strategy: 'fixed',
  whileElementsMounted: autoUpdate,
  middleware: [shift(), autoPlacement()]
});

const floatingCardStyle = computed(() => ({
  left: `${x.value ?? 0}px`,
  top: `${y.value ?? 0}px`,
  position: strategy.value
}));

const showCardTimeout = useTimeoutFn(
  () => {
    isDisplayed.value = true;

    const width = config.TILE_SIZE.x;
    const height = config.TILE_SIZE.y + config.TILE_SIZE.z;

    virtualEl.value = {
      getBoundingClientRect() {
        return {
          x: position.x,
          y: position.y,
          top: position.y,
          left: position.x,
          bottom: position.y + height,
          right: position.x + width,
          width,
          height
        };
      }
    };
  },
  timeout,
  {
    immediate: false
  }
);

watch(
  () => isOpened,
  opened => {
    if (!opened) {
      isDisplayed.value = false;
      showCardTimeout.stop();
    } else {
      showCardTimeout.start();
    }
  }
);

const root = document.body;
</script>

<template>
  <External :root="root" v-if="isDisplayed">
    <Transition appear>
      <div
        ref="floating"
        :style="floatingCardStyle"
        class="virtual-floating-card"
      >
        <slot />
      </div>
    </Transition>
  </External>
</template>

<style lang="postcss" scoped>
.virtual-floating-card {
  pointer-events: none;
  &.v-enter-active {
    transition: opacity 0.2s var(--ease-2);
  }

  &.v-enter-from {
    opacity: 0;
  }
}
</style>

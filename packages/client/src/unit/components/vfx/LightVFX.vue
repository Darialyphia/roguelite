<script setup lang="ts">
import { waitFor, type BetterOmit, type Point } from '@game/shared';
import { BLEND_MODES, Matrix } from 'pixi.js';
import { PTransitionGroup } from 'vue3-pixi';
import { radialGradient } from '@/utils/sprite';
import { config } from '@/utils/config';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';

let nextId = 1;

type Light = {
  startColor: string;
  endColor: string;
  offset: Point;
  alpha: number;
  radius: number;
  id: number;
  blendMode: BLEND_MODES;
};
const lights = ref([]) as Ref<Light[]>;

const addLight = async (config: BetterOmit<Light, 'id'>, duration?: number) => {
  const el = {
    id: ++nextId,
    ...config
  };
  lights.value.push(el);
  if (duration) {
    await waitFor(duration);
    lights.value.splice(lights.value.indexOf(el, 1));
  }
};

// addLight({
//   alpha: 0.7,
//   blendMode: BLEND_MODES.ADD,
//   startColor: 'hsl(50,60%,60%)',
//   endColor: 'rgba(0,0,0,0)',
//   offset: { x: 0, y: 0 },
//   radius: config.AMBIENT_LIGHT_UNIT_SIZE / 2
// });

const ui = useBattleUiStore();
</script>

<template>
  <container
    :ref="(container: any) => ui.assignLayer(container, 'fx')"
    :sortable-children="true"
    event-mode="none"
  >
    <PTransitionGroup
      :duration="{ enter: 300, leave: 300 }"
      :before-enter="{ alpha: 0 }"
      :enter="{ alpha: 1 }"
      :leave="{ alpha: 0 }"
    >
      <container v-for="light in lights" :key="light.id" :z-order="999">
        <graphics
          :alpha="light.alpha"
          :blend-mode="light.blendMode"
          @render="
            g => {
              try {
                g.clear();
                const texture = radialGradient(
                  light.radius * 2,
                  light.radius * 2,
                  [
                    [0, light.startColor],
                    [0.75, light.endColor]
                  ]
                );

                g.beginTextureFill({
                  texture,
                  matrix: new Matrix().translate(
                    light.offset.x + light.radius,
                    light.offset.y + light.radius
                  )
                });
                g.drawCircle(0, 0, light.radius);
                g.endFill();
              } catch (err) {
                console.log(err);
              }
            }
          "
        />
      </container>
    </PTransitionGroup>
  </container>
</template>

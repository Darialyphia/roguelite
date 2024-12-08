<script setup lang="ts">
import { waitFor, type BetterOmit, type Point } from '@game/shared';
import { BLEND_MODES, Matrix } from 'pixi.js';
import { PTransitionGroup } from 'vue3-pixi';
import { radialGradient } from '@/utils/sprite';
import { config } from '@/utils/config';

let nextId = 1;

type Light = {
  color: string;
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

addLight({
  alpha: 1,
  blendMode: config.AMBIENT_LIGHT_BLEND_MODE,
  color: 'rgba(0,0,0,0)',
  offset: { x: 0, y: 0 },
  radius: config.AMBIENT_LIGHT_UNIT_SIZE / 2
});
</script>

<template>
  <PTransitionGroup
    :duration="{ enter: 300, leave: 300 }"
    :before-enter="{ alpha: 0 }"
    :enter="{ alpha: 1 }"
    :leave="{ alpha: 0 }"
  >
    <container v-for="light in lights" :key="light.id">
      <graphics
        :alpha="light.alpha"
        :blend-mode="light.blendMode"
        :z-index="999"
        :z-order="999"
        @render="
          g => {
            try {
              g.clear();
              const texture = radialGradient(
                light.radius * 2,
                light.radius * 2,
                [
                  [0, light.color],
                  [0.9, config.AMBIENT_LIGHT_COLOR]
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
</template>

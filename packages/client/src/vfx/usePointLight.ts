import { useSafeInject } from '@/shared/composables/useSafeInject';
import { dist, type Point } from '@game/shared';
import type { BLEND_MODES, DisplayObject } from 'pixi.js';
import type { InjectionKey } from 'vue';
import { onTick } from 'vue3-pixi';

export type PointLightConfig = {
  colorStops: Array<[number, string]>;
  position: Point;
  radius: number;
  blendMode: BLEND_MODES;
  group: string;
};

type PointLighInstance = PointLightConfig & { root: DisplayObject };
type PointLightContext = {
  registerLight(light: PointLighInstance): () => void;
};

const POINT_LIGHTS_INJECTION_KEY = Symbol(
  'pointLights'
) as InjectionKey<PointLightContext>;
export const providePointLights = () => {
  const lights: PointLighInstance[] = [];

  const PROXIMITY_THRESHOLD = 300; // Example threshold distance
  const MIN_ALPHA = 0.5;
  onTick(() => {
    lights.forEach(light => {
      light.root.alpha = 1;
    });
    for (let i = 0; i < lights.length; i++) {
      for (let j = 0; j < lights.length; j++) {
        const lightA = lights[i];
        const lightB = lights[j];

        if (lightA === lightB) {
          continue;
        }
        if (lightA.group === lightB.group) continue;

        const distance = dist(
          lightA.root.getGlobalPosition(),
          lightB.root.getGlobalPosition()
        );

        if (distance < PROXIMITY_THRESHOLD) {
          // Adjust the alpha based on proximity
          const dimmingFactor = Math.max(
            MIN_ALPHA,
            1 - (PROXIMITY_THRESHOLD - distance) / PROXIMITY_THRESHOLD
          );

          lightA.root.alpha = Math.min(lightA.root.alpha, dimmingFactor);
          lightB.root.alpha = Math.min(lightB.root.alpha, dimmingFactor);
        }
      }
    }
  });
  provide(POINT_LIGHTS_INJECTION_KEY, {
    registerLight(light) {
      lights.push(light);

      return () => {
        lights.splice(lights.indexOf(light));
      };
    }
  });
};

export const usePointLights = () => useSafeInject(POINT_LIGHTS_INJECTION_KEY);

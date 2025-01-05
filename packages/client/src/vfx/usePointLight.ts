import type { CameraContext } from '@/board/composables/useCamera';
import { useSafeInject } from '@/shared/composables/useSafeInject';
import { config } from '@/utils/config';
import { dist, mapRange, type Point } from '@game/shared';
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
export const providePointLights = (camera: CameraContext) => {
  const lights: PointLighInstance[] = [];

  const PROXIMITY_THRESHOLD = 300; // Example threshold distance
  const MIN_ALPHA = 0.5;
  const MIN_ZOOM_LEVEL_FOR_ATTENUATION = 2;

  // Dims the lights depending on zoom level and proximity of other lights
  onTick(() => {
    const zoom = camera.viewport.value!.scaled;
    const zoomDimmingFactor =
      zoom < MIN_ZOOM_LEVEL_FOR_ATTENUATION
        ? 0
        : mapRange(1 - (config.MAX_ZOOM - zoom), [0, 1], [0, 0.15]);

    lights.forEach(light => {
      light.root.alpha = 1 - zoomDimmingFactor;
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

        const dimmingFactor =
          distance < PROXIMITY_THRESHOLD
            ? (PROXIMITY_THRESHOLD - distance) / PROXIMITY_THRESHOLD
            : 0;

        lightA.root.alpha = Math.max(
          MIN_ALPHA,
          lightA.root.alpha - dimmingFactor
        );
        lightB.root.alpha = Math.max(
          MIN_ALPHA,
          lightB.root.alpha - dimmingFactor
        );
        // lightA.root.alpha = Math.min(
        //   MIN_ALPHA,
        //   lightA.root.alpha - zoomDimmingFactor
        // );
      }
    }
  });
  provide(POINT_LIGHTS_INJECTION_KEY, {
    registerLight(light) {
      lights.push(light);

      return () => {
        lights.splice(lights.indexOf(light), 1);
      };
    }
  });
};

export const usePointLights = () => useSafeInject(POINT_LIGHTS_INJECTION_KEY);

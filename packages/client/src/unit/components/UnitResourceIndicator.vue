<script setup lang="ts">
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import type { UnitViewModel } from '../unit.model';
import { useBattleEvent } from '@/pages/battle/battle.store';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';
import type { AnimatedSprite } from 'pixi.js';
import { GAME_EVENTS } from '@game/engine/src/game/game';
import { waitFor } from '@game/shared';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const ui = useBattleUiStore();

const sprite = ref<AnimatedSprite>();
useBattleEvent(GAME_EVENTS.PLAYER_BEFORE_VP_CHANGE, async e => {
  if (!e.player.equals(unit.player.getPlayer())) return Promise.resolve();
  if (!sprite.value) return;

  sprite.value.position.y = -10;
  await gsap.to(sprite.value!, {
    pixi: {
      alpha: 1,
      y: -45,
      ease: Power2.easeOut
    },
    duration: 0.3,
    onComplete() {
      setTimeout(() => {
        sprite.value!.alpha = 0;
      }, 1000);
    }
  });
});
</script>

<template>
  <sprite
    :ref="
      (obj: any) => {
        ui.assignLayer(obj, 'ui');
        if (!obj) return;
        sprite = obj;
      }
    "
    texture="/assets/ui/vp-large.png"
    :anchor="0.5"
    event-mode="none"
    playing
    loop
    :scale="0.5"
    :alpha="0"
    :x="0"
    :y="-45"
  />
</template>

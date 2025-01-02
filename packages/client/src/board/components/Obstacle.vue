<script setup lang="ts">
import { useUserPlayer } from '@/pages/battle/battle.store';
import type { PlayerViewModel } from '@/player/player.model';
import UiAnimatedSprite from '@/ui/components/UiAnimatedSprite.vue';
import { config } from '@/utils/config';
import type { CellViewModel } from '../models/cell.model';
import type { Defined } from '@game/shared';
import { TextStyle } from 'pixi.js';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';
import { createSpritesheetFrameObject } from '@/utils/sprite';
import { useBattleUiStore } from '@/pages/battle/battle-ui.store';

const { obstacle } = defineProps<{
  obstacle: Defined<CellViewModel['obstacle']>;
}>();

const userPlayer = useUserPlayer();

const tag = computed(() => {
  if (!obstacle.player) return 'idle';
  if (obstacle.blueprintId === 'altar' && obstacle.meta.isDestoyed)
    return 'idle';

  return userPlayer.value.getPlayer().equals(obstacle.player.getPlayer())
    ? 'ally'
    : 'enemy';
});

const getTextStyle = (color: number) => {
  return new TextStyle({
    fontSize: 20,
    fill: color,
    fontFamily: 'SilkScreen',
    align: 'center'
  });
};

const sheet = useSpritesheet<'', 'base'>('altar-stats');
const textures = computed(() => {
  if (!sheet.value) return null;

  return createSpritesheetFrameObject('idle', sheet.value.sheets.base.base);
});
const ui = useBattleUiStore();
</script>

<template>
  <container>
    <UiAnimatedSprite
      :assetId="obstacle.spriteId"
      :y="-config.TILE_SIZE.y / 2"
      :tag="tag"
    />

    <animated-sprite
      v-if="
        textures &&
        obstacle.blueprintId === 'altar' &&
        !obstacle.meta.isDestroyed
      "
      :ref="
        (obj: any) => {
          ui.assignLayer(obj, 'ui');
          if (!obj) return;
        }
      "
      :textures="textures"
      :anchor="0.5"
      event-mode="none"
      playing
      loop
      :y="-config.TILE_SIZE.y"
      :x="-15"
    >
      <pixi-text
        :style="getTextStyle(0x84f200)"
        :y="-2"
        :scale="0.5"
        :anchor="0.5"
      >
        {{ obstacle.meta.hp.current }}
      </pixi-text>
    </animated-sprite>
  </container>
</template>

<style scoped lang="postcss"></style>

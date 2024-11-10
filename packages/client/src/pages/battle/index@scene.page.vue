<script lang="ts" setup>
import { ClientSession, ServerSession } from '@game/engine';
import { useBattleStore } from './battle.store';
import BoardCell from '@/board/components/BoardCell.vue';
import { config } from '@/utils/config';
import IsoWorld from '@/iso/components/IsoWorld.vue';
import IsoCamera from '@/iso/components/IsoCamera.vue';
import { useKeyboardControl } from '@/shared/composables/useKeyboardControl';
import { useSettingsStore } from '@/shared/composables/useSettings';
import { useSpritesheet } from '@/shared/composables/useSpritesheet';

import AnimatedIsoPoint from '@/iso/components/AnimatedIsoPoint.vue';
import MultiLayerAnimatedSprite from '@/shared/components/MultiLayerAnimatedSprite.vue';
import { useBattleUiStore } from './battle-ui.store';

definePage({
  name: 'Battle'
});

const serverSession = new ServerSession({
  rngSeed: 'test-seed',
  mapId: 'testMap1v1',
  teams: []
});
const clientSession = new ClientSession({
  rngValues: [...serverSession.game.rngSystem.values],
  mapId: 'testMap1v1',
  teams: []
});

const battleStore = useBattleStore();
battleStore.init(clientSession);

const settingsStore = useSettingsStore();
const isoWorld = useTemplateRef('isoWorld');
useKeyboardControl(
  () => settingsStore.settings.bindings.rotateCW.control,
  () => isoWorld.value?.camera.rotateCW()
);
useKeyboardControl(
  () => settingsStore.settings.bindings.rotateCCW.control,
  () => isoWorld.value?.camera.rotateCCW()
);

const spritesheet = useSpritesheet<
  'tier1' | 'tier2' | 'tier3' | 'tier4',
  'body',
  'armor' | 'helm' | 'weapon' | 'vfx'
>('wizard');

const ui = useBattleUiStore();
</script>

<template>
  <IsoWorld
    ref="isoWorld"
    v-if="battleStore.session"
    :angle="0"
    :width="battleStore.session.game.boardSystem.width"
    :height="battleStore.session.game.boardSystem.height"
    :tile-size="config.TILE_SIZE"
  >
    <IsoCamera
      :width="battleStore.session.game.boardSystem.width"
      :height="battleStore.session.game.boardSystem.height"
    >
      <BoardCell v-for="cell in battleStore.state.cells" :key="cell.id" :cell />

      <AnimatedIsoPoint :position="{ x: 3, y: 2, z: 0 }" :z-index-offset="32">
        <MultiLayerAnimatedSprite
          v-if="spritesheet"
          :sheet="spritesheet"
          tag="idle"
          :parts="ui.parts"
        />
      </AnimatedIsoPoint>
    </IsoCamera>
  </IsoWorld>
</template>

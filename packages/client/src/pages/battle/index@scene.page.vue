<script lang="ts" setup>
import { ClientSession, ServerSession } from '@game/engine';
import { useBattleStore } from './battle.store';
import BoardCell from '@/board/components/BoardCell.vue';
import Unit from '@/unit/Unit.vue';
import { config } from '@/utils/config';
import IsoWorld from '@/iso/components/IsoWorld.vue';
import IsoCamera from '@/iso/components/IsoCamera.vue';
import { useKeyboardControl } from '@/shared/composables/useKeyboardControl';
import { useSettingsStore } from '@/shared/composables/useSettings';
import type { GameOptions } from '@game/engine/src/game/game';

definePage({
  name: 'Battle'
});

const options: Pick<GameOptions, 'mapId' | 'teams'> = {
  mapId: 'testMap1v1',
  teams: [
    [
      {
        id: 'player',
        units: [
          {
            blueprintId: 'test-unit',
            deck: [
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' }
            ],
            spriteParts: {
              armor: 'tier3',
              helm: 'tier3',
              weapon: 'tier3',
              vfx: 'tier3'
            },
            position: { x: 0, y: 0, z: 0 }
          }
        ],
        roster: []
      }
    ],
    [
      {
        id: 'ai',
        roster: [],
        units: [
          {
            blueprintId: 'test-unit',
            deck: [
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' },
              { blueprintId: 'test-card' }
            ],
            spriteParts: {
              armor: 'tier3',
              helm: 'tier3',
              weapon: 'tier3',
              vfx: 'tier3'
            },
            position: { x: 8, y: 0, z: 0 }
          }
        ]
      }
    ]
  ]
};
const serverSession = new ServerSession({
  rngSeed: 'test-seed',
  ...options
});
const clientSession = new ClientSession({
  rngValues: [...serverSession.game.rngSystem.values],
  ...options
});

const battleStore = useBattleStore();
const start = async () => {
  await serverSession.initialize();
  battleStore.init(clientSession, input => {
    serverSession.dispatch(input);
  });
};
start();

const settingsStore = useSettingsStore();
const isoWorld = useTemplateRef('isoWorld');

useKeyboardControl(
  'keydown',
  () => settingsStore.settings.bindings.rotateCW.control,
  () => isoWorld.value?.camera.rotateCW()
);
useKeyboardControl(
  'keydown',
  () => settingsStore.settings.bindings.rotateCCW.control,
  () => isoWorld.value?.camera.rotateCCW()
);
</script>

<template>
  <IsoWorld
    ref="isoWorld"
    v-if="battleStore.session && battleStore.isReady"
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

      <Unit v-for="unit in battleStore.state.units" :key="unit.id" :unit />
    </IsoCamera>
  </IsoWorld>
</template>

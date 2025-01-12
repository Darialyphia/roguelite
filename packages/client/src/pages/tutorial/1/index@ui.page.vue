<script setup lang="ts">
import type { TutorialSessionOptions } from '@game/engine/src/tutorial-session';
import TutorialUi from '@/tutorial/components/TutorialUi.vue';
import type { ServerSession } from '@game/engine';
import { useTutorialStore } from '@/tutorial/tutorial.store';
import { useBattleUiStore } from '@/battle/stores/battle-ui.store';
import { until, useEventListener } from '@vueuse/core';
import { useBattleStore } from '@/battle/stores/battle.store';
import { RUNES } from '@game/engine/src/utils/rune';
import type { EntityId } from '@game/engine/src/entity';

definePage({
  name: 'Tutorial1'
});

const tutorial = useTutorialStore();
const ui = useBattleUiStore();
const battle = useBattleStore();

const options: Pick<TutorialSessionOptions, 'mapId' | 'teams' | 'steps'> = {
  mapId: 'tutorial-1',
  teams: [
    [
      {
        id: 'player',
        name: 'Daria',
        deck: {
          general: { blueprintId: 'red-general-flame-lord' },
          cards: [
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' }
          ]
        }
      }
    ],
    [
      {
        id: 'ai',
        name: 'AI',
        deck: {
          general: { blueprintId: 'red-general-flame-lord' },
          cards: [
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' },
            { blueprintId: 'red-footman' }
          ]
        }
      }
    ]
  ],
  steps: [
    {
      expectedInputs: [
        { type: 'mulligan', payload: { playerId: 'player', indices: [] } },
        { type: 'mulligan', payload: { playerId: 'ai', indices: [] } }
      ],
      meta: {},
      tooltips: []
    },
    {
      onEnter() {
        tutorial.isDrawActionEnabled = false;
        tutorial.isGoldActionEnabled = false;
        tutorial.isRuneActionEnabled = false;
        tutorial.isResourcesDisplayed = false;
        tutorial.isDeckDisplayed = false;
        tutorial.isVPDisplayed = false;
        tutorial.isQuestsDisplayed = false;
        tutorial.isResourcesDisplayed = false;
        tutorial.isHandDisplayed = false;
        tutorial.isOpponentHandDisplayed = false;
        tutorial.isEndTurnDisplayed = false;
        tutorial.isResourceWarningEnabled = false;
      },
      expectedInputs: [
        {
          type: 'move',
          payload: { unitId: 'unit_1', playerId: 'player', x: 3, y: 2, z: 0 }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Welcome to the first tutorial for Worselyst !',
          canClickNext: true
        },
        {
          text: 'Here, you will learn the basics of movement and combat.',
          canClickNext: true
        },
        {
          text: 'You start every game with a general on the board.',
          canClickNext: true,
          onEnter() {
            tutorial.highlightedCell = { x: 0, y: 2, z: 0 };
          }
        },
        {
          text: 'Click on your general to select it.',
          canClickNext: false,
          onEnter(next) {
            until(() => ui.selectedUnit?.id === 'unit_1')
              .toBeTruthy()
              .then(next);
          }
        },
        {
          text: 'The tiles highlighted in blue indicate where your general can move.',
          canClickNext: true,
          onEnter() {
            tutorial.highlightedCell = null;
          }
        },
        {
          text: 'Click on the highlighted tile to move.',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedCell = { x: 3, y: 2, z: 0 };
          },
          onLeave() {
            tutorial.highlightedCell = null;
          }
        }
      ]
    },
    {
      meta: {},
      expectedInputs: [{ type: 'endTurn', payload: { playerId: 'player' } }],
      tooltips: [
        {
          text: 'Most units can only attack units that are nearby them. Your general is too far away to attack the opponent !',
          canClickNext: true
        },
        {
          text: 'You can hold the Shift key to see your attack range.',
          canClickNext: false,
          onEnter(next) {
            useEventListener(
              'keydown',
              e => {
                if (e.code === 'ShiftLeft') {
                  next();
                }
              },
              { once: true }
            );
          }
        },
        {
          text: 'The cells where you can attack are highlighted in red.',
          canClickNext: true
        },
        {
          text: 'Your general is no longer able to act this turn. So press the "End Turn" button on the bottom left of the screen.',
          canClickNext: false,
          onEnter() {
            tutorial.isEndTurnDisplayed = true;
            tutorial.highlightedElementId = 'end-turn-action-button';
          },
          onLeave() {
            tutorial.highlightedElementId = null;
          }
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'move',
          payload: { playerId: 'ai', unitId: 'unit_2', x: 4, y: 2, z: 0 }
        },
        {
          type: 'endTurn',
          payload: { playerId: 'ai' }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'It is now my turn to play. I also have my own general that I can move.',
          canClickNext: true,
          onLeave() {
            battle.dispatch({
              type: 'move',
              payload: { playerId: 'ai', unitId: 'unit_2', x: 4, y: 2, z: 0 }
            });
            battle.dispatch({
              type: 'endTurn',
              payload: { playerId: 'ai' }
            });
          }
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'attack',
          payload: { playerId: 'player', unitId: 'unit_1', x: 4, y: 2, z: 0 }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'I moved my general closer. You should be able to attack him now.',
          canClickNext: true
        },
        {
          text: 'Select your general, and click on the enemy unit.',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedCell = { x: 4, y: 2, z: 0 };
          },
          onLeave() {
            tutorial.highlightedCell = null;
          }
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'runeResourceAction',
          payload: { playerId: 'player', rune: RUNES.RED.id as any }
        },
        {
          type: 'playCard',
          payload: {
            playerId: 'player',
            index: 0,
            targets: [{ x: 2, y: 2, z: 0 }]
          }
        },
        { type: 'endTurn', payload: { playerId: 'player' } }
      ],
      meta: {},
      tooltips: [
        {
          text: 'You can see the damage done by checking the HP indicator on the bottom right of an unit. When it reaches 0, the unit is estroyed !',
          canClickNext: true
        },
        {
          text: 'When attacking, a unit will inflict damage equal to its attack, indicated on the bottom left of the unit.',
          canClickNext: true
        },
        {
          text: 'You can notice that both generals took damage. That is because in this game, units can counterattack.',
          canClickNext: true
        },
        {
          text: 'Most units can counterattack once per turn.',
          canClickNext: true
        },
        {
          text: 'I will now summon another unit on the board for you.',
          canClickNext: true,
          onLeave() {
            battle.dispatch({
              type: 'runeResourceAction',
              payload: { playerId: 'player', rune: RUNES.RED.id as any }
            });
            battle.dispatch({
              type: 'playCard',
              payload: {
                playerId: 'player',
                index: 0,
                targets: [{ x: 2, y: 2, z: 0 }]
              }
            });
          }
        },
        {
          text: "Units cannot act on the turn the're summoned.",
          canClickNext: true
        },
        {
          text: "You can't do anything else for now, so let's end your turn.",
          canClickNext: false,
          onEnter() {
            tutorial.highlightedElementId = 'end-turn-action-button';
          },
          onLeave() {
            tutorial.highlightedElementId = null;
          }
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'move',
          payload: { playerId: 'ai', unitId: 'unit_2', x: 2, y: 3, z: 0 }
        },
        {
          type: 'attack',
          payload: { playerId: 'ai', unitId: 'unit_2', x: 2, y: 2, z: 0 }
        },
        { type: 'endTurn', payload: { playerId: 'ai' } }
      ],
      onEnter() {
        setTimeout(() => {
          console.log('dispatch move');
          battle.dispatch({
            type: 'move',
            payload: { playerId: 'ai', unitId: 'unit_2', x: 2, y: 3, z: 0 }
          });
          setTimeout(() => {
            console.log('dispatch attack');
            battle.dispatch({
              type: 'attack',
              payload: { playerId: 'ai', unitId: 'unit_2', x: 2, y: 2, z: 0 }
            });
            setTimeout(() => {
              console.log('dispatch end turn');
              battle.dispatch({ type: 'endTurn', payload: { playerId: 'ai' } });
            }, 2000);
          }, 2000);
        }, 1000);
      },
      meta: {},
      tooltips: []
    },
    {
      expectedInputs: [
        {
          type: 'attack',
          payload: { playerId: 'player', unitId: 'unit_1', x: 2, y: 3, z: 0 }
        },
        {
          type: 'attack',
          payload: { playerId: 'player', unitId: 'unit_3', x: 2, y: 3, z: 0 }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Your footman only has 2HP left ! If you attacked my general with it, he would counterattack and destroy it.',
          canClickNext: true
        },
        {
          text: 'To avoid this, attack him with your general, then your footman',
          canClickNext: false
        }
      ]
    },
    {
      expectedInputs: [],
      meta: {},
      tooltips: [{ text: 'Tutorial complete', canClickNext: false }]
    }
  ]
};
const rngSeed = ':yussy:';

const onReady = (server: ServerSession) => {
  server.dispatch({
    type: 'mulligan',
    payload: { playerId: 'player', indices: [] }
  });
  server.dispatch({
    type: 'mulligan',
    payload: { playerId: 'ai', indices: [] }
  });
};
</script>

<template>
  <TutorialUi
    :options="options"
    :rng-seed="rngSeed"
    player-id="player"
    @ready="
      ({ server }) => {
        onReady(server);
      }
    "
  />
</template>

<script setup lang="ts">
import type { TutorialSessionOptions } from '@game/engine/src/tutorial-session';
import TutorialUi from '@/tutorial/components/TutorialUi.vue';
import type { ServerSession } from '@game/engine';
import { useTutorialStore } from '@/tutorial/tutorial.store';
import { useBattleUiStore } from '@/battle/stores/battle-ui.store';
import { until, useEventListener } from '@vueuse/core';
import { useBattleStore } from '@/battle/stores/battle.store';
import { RUNES } from '@game/engine/src/utils/rune';
import { waitFor, type BetterOmit } from '@game/shared';
import { RouterLink } from 'vue-router';
import { defaultConfig } from '@game/engine/src/config';

definePage({
  name: 'Tutorial1'
});

const tutorial = useTutorialStore();
const ui = useBattleUiStore();
const battle = useBattleStore();
const isFinished = ref(false);
const options: BetterOmit<
  TutorialSessionOptions,
  'history' | 'onInvalidInput'
> = {
  mapId: '1v1',
  configOverrides: {
    SHUFFLE_DECK_ON_GAME_START: false
  },
  teams: [
    [
      {
        id: 'player',
        name: 'Daria',
        deck: {
          altar: { blueprintId: 'altar' },
          cards: [
            { blueprintId: 'red-footman' },
            { blueprintId: 'tutorial-berserk' },
            { blueprintId: 'tutorial-berserk' },
            { blueprintId: 'tutorial-berserk' },
            { blueprintId: 'tutorial-berserk' },
            { blueprintId: 'red-fireball' },
            { blueprintId: 'red-berserk' },
            { blueprintId: 'tutorial-spell' },
            { blueprintId: 'tutorial-quest' },
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
          altar: { blueprintId: 'altar' },
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
        tutorial.isGoldResourcesDisplayed = false;
        tutorial.isRuneResourcesDisplayed = false;
        tutorial.isDeckDisplayed = false;
        tutorial.isVPDisplayed = false;
        tutorial.isQuestsDisplayed = false;
        tutorial.isHandDisplayed = false;
        tutorial.isOpponentHandDisplayed = false;
        tutorial.isEndTurnDisplayed = false;
        tutorial.isResourceWarningEnabled = false;
      },
      expectedInputs: [
        {
          type: 'runeResourceAction',
          payload: {
            playerId: 'player',
            rune: 'RED'
          }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Welcome to the first tutorial for Worselyst !',
          canClickNext: true
        },
        {
          text: 'This is your altar.',
          canClickNext: true,
          onEnter() {
            tutorial.highlightedCell = { x: 2, y: 5, z: 1 };
          },
          onLeave() {
            tutorial.highlightedCell = null;
          }
        },
        {
          text: 'This is your hand.',
          canClickNext: true,
          async onEnter() {
            tutorial.isHandDisplayed = true;
            await waitFor(100);
            tutorial.highlightedElementId = 'player-hand';
          },
          onLeave() {
            tutorial.highlightedElementId = null;
          }
        },
        {
          text: 'To play card you need gold and runes.',
          canClickNext: true,
          onEnter() {
            tutorial.isGoldResourcesDisplayed = true;
            tutorial.isRuneResourcesDisplayed = true;
          }
        },
        {
          text: 'Currently you have 3 gold, but no runes.',
          canClickNext: true,
          onEnter() {
            tutorial.highlightedElementId = 'player_player_gold';
          },
          onLeave() {
            tutorial.highlightedElementId = null;
          }
        },
        {
          text: 'Once per turn you can gain one rune. Try it !.',
          canClickNext: false,
          onEnter() {
            tutorial.isRuneActionEnabled = true;
            tutorial.highlightedElementId = 'rune_action_red';
          }
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'playCard',
          payload: {
            playerId: 'player',
            index: 0,
            targets: [{ x: 3, y: 5, z: 1 }]
          }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'You know have unlocked enough runes to play the cards in your hands.',
          canClickNext: true
        },
        {
          text: 'You can play unit cards nearby your alter. Play the highlighted card on the highlighted tile',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedCell = { x: 3, y: 5, z: 1 };
            tutorial.highlightedElementId = 'hand_card_0';
          },
          onLeave() {
            tutorial.highlightedCell = null;
            tutorial.highlightedElementId = null;
          }
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'endTurn',
          payload: {
            playerId: 'player'
          }
        }
      ],
      meta: {},
      onEnter() {
        tutorial.isEndTurnDisplayed = true;
        tutorial.highlightedElementId = 'end-turn-action-button';
      },
      tooltips: [
        {
          text: 'Units cannot act the turn they are summoned.',
          canClickNext: true
        },
        {
          text: "You don't have enough gold to play anymore cards. Let's end your turn.",
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
          type: 'runeResourceAction',
          payload: {
            playerId: 'ai',
            rune: 'RED'
          }
        },
        {
          type: 'playCard',
          payload: {
            playerId: 'ai',
            index: 0,
            targets: [{ x: 7, y: 5, z: 1 }]
          }
        },
        {
          type: 'endTurn',
          payload: { playerId: 'ai' }
        }
      ],
      meta: {},
      onEnter() {
        tutorial.isOpponentHandDisplayed = true;
      },
      tooltips: [
        {
          text: "It's now my turn. Like you, I will gain a rune and play a unit",
          canClickNext: true,
          async onLeave() {
            battle.dispatch({
              type: 'runeResourceAction',
              payload: {
                playerId: 'ai',
                rune: 'RED'
              }
            });
            await waitFor(1500);
            battle.dispatch({
              type: 'playCard',
              payload: {
                playerId: 'ai',
                index: 0,
                targets: [{ x: 7, y: 5, z: 1 }]
              }
            });
            await waitFor(3000);
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
          type: 'goldResourceAction',
          payload: {
            playerId: 'player'
          }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'At the start of your turn, you gain 3 gold.',
          canClickNext: true,
          onEnter() {
            tutorial.highlightedElementId = tutorial.highlightedElementId =
              'player_player_gold';
          },
          onLeave() {
            tutorial.highlightedElementId = null;
          }
        },
        {
          text: 'You have enough runes, but not enough gold to play your units.',
          canClickNext: true
        },
        {
          text: 'Instead of gaining a rune, once per turn you can choose to draw a card or gain 1 gold.',
          canClickNext: true,
          onEnter() {
            tutorial.isGoldActionEnabled = true;
            tutorial.isDrawActionEnabled = true;
          }
        },
        {
          text: 'Gain one gold so you can play your Berzerk.',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedElementId = 'gold-action-button';
          }
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'playCard',
          payload: {
            playerId: 'player',
            index: 0,
            targets: [{ x: 3, y: 4, z: 1 }]
          }
        }
      ],
      meta: {},
      onEnter() {
        tutorial.highlightedElementId = 'hand_card_0';
        tutorial.highlightedCell = { x: 3, y: 4, z: 1 };
        console.log(tutorial.highlightedElement);
      },
      onLeave() {
        tutorial.highlightedElementId = null;
        tutorial.highlightedCell = null;
      },
      tooltips: [
        {
          text: 'Now, play your Berserk on the highlighted cell.',
          canClickNext: false
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'move',
          payload: {
            playerId: 'player',
            unitId: 'unit_3',
            x: 4,
            y: 7,
            z: 1
          }
        }
      ],
      meta: {},
      tooltips: [
        { text: "let's now learn how to use your units.", canClickNext: true },
        {
          text: 'Your footman can act. Click on it to select it.',
          canClickNext: false,
          onEnter(next) {
            tutorial.highlightedCell = { x: 3, y: 5, z: 1 };
            const id = computed(() => ui.selectedUnit?.id);
            watchEffect(() => {
              console.log(id.value);
            });
            until(computed(() => ui.selectedUnit?.id))
              .toBe('unit_3')
              .then(() => {
                console.log('should next');
                next();
              });
          }
        },
        {
          text: 'Move your footman to the highlighted cell.',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedCell = { x: 4, y: 7, z: 1 };
          }
        },
        {
          text: 'Your footman is now standing on a Victory Shrine',
          canClickNext: true
        },
        {
          text: 'Having a unit on a victory shrine at the start of your turn earns you one Victory Point',
          canClickNext: true
        },
        {
          text: `Earn ${defaultConfig.VP_WIN_THRESHOLD} to win the game !`,
          canClickNext: true
        }
      ]
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
  <div>
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
    <div v-if="isFinished" class="finished-message">
      <div>
        <h1>Tutorial Completed ! Congratulations !</h1>
        <RouterLink :to="{ name: 'Home' }">Back to Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.finished-message {
  position: fixed;
  pointer-events: auto;
  inset: 0;
  display: grid;
  place-content: center;
  z-index: 99;
  background-color: hsl(0 0 0 / 0.5);
  backdrop-filter: blur(5px);

  > div {
    font-size: var(--font-size-5);
    color: #efef9f;
    background-color: #32021b;
    padding: var(--size-5);
    border: solid 6px #efef9f;
    border-right-color: #d7ad42;
    border-bottom-color: #d7ad42;

    a {
      text-decoration: underline;
    }
  }
}
</style>

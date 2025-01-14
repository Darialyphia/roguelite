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

definePage({
  name: 'Tutorial1'
});

const tutorial = useTutorialStore();
const ui = useBattleUiStore();
const battle = useBattleStore();
const isFinished = ref(false);
const options: BetterOmit<TutorialSessionOptions, 'history'> = {
  mapId: 'tutorial-1',
  configOverrides: {
    SHUFFLE_DECK_ON_GAME_START: false
  },
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
        tutorial.isGoldResourcesDisplayed = false;
        tutorial.isRuneResourcesDisplayed = false;
        tutorial.isDeckDisplayed = false;
        tutorial.isVPDisplayed = false;
        tutorial.isQuestsDisplayed = false;
        tutorial.isHandDisplayed = false;
        tutorial.isOpponentHandDisplayed = false;
        tutorial.isEndTurnDisplayed = false;
        tutorial.areObstaclesDisplayed = false;
        tutorial.isResourceWarningEnabled = false;
      },
      expectedInputs: [
        {
          type: 'move',
          payload: { unitId: 'unit_1', playerId: 'player', x: 2, y: 2, z: 0 }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Welcome to the first tutorial for Worselyst !',
          canClickNext: true
        },
        {
          text: 'Here, you will learn the basics of the game. I promise to try and make it short !',
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
            tutorial.highlightedCell = { x: 2, y: 2, z: 0 };
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
          payload: { playerId: 'ai', unitId: 'unit_2', x: 3, y: 2, z: 0 }
        },
        {
          type: 'endTurn',
          payload: { playerId: 'ai' }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'It is now my turn to play. will move my general closer so you can try to attack him.',
          canClickNext: true,
          async onLeave() {
            await waitFor(500);
            battle.dispatch({
              type: 'move',
              payload: { playerId: 'ai', unitId: 'unit_2', x: 3, y: 2, z: 0 }
            });

            await waitFor(1000);
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
          payload: { playerId: 'player', unitId: 'unit_1', x: 3, y: 2, z: 0 }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Select your general, and click on the enemy unit.',
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
            targets: [{ x: 2, y: 3, z: 0 }]
          }
        },
        { type: 'endTurn', payload: { playerId: 'player' } }
      ],
      meta: {},
      tooltips: [
        {
          text: 'You can see the damage done by checking the HP indicator on the bottom right of an unit. When it reaches 0, the unit is destroyed !',
          canClickNext: true
        },
        {
          text: 'When attacking, a unit will inflict damage equal to its attack, indicated on the bottom left of the unit.',
          canClickNext: true
        },
        {
          text: 'You can notice that both generals took damage. That is because in this game, units can counterattack once per turn.',
          canClickNext: true
        },
        {
          text: 'I will now summon another unit on the board for you.',
          canClickNext: true,
          async onLeave() {
            battle.dispatch({
              type: 'runeResourceAction',
              payload: { playerId: 'player', rune: RUNES.RED.id as any }
            });
            await waitFor(500);
            battle.dispatch({
              type: 'playCard',
              payload: {
                playerId: 'player',
                index: 0,
                targets: [{ x: 2, y: 3, z: 0 }]
              }
            });
          }
        },
        {
          text: "Units cannot act on the turn the're summoned, so let's end your turn.",
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
          type: 'attack',
          payload: { playerId: 'ai', unitId: 'unit_2', x: 2, y: 3, z: 0 }
        },
        { type: 'endTurn', payload: { playerId: 'ai' } }
      ],
      onEnter() {
        setTimeout(() => {
          battle.dispatch({
            type: 'attack',
            payload: { playerId: 'ai', unitId: 'unit_2', x: 2, y: 3, z: 0 }
          });
          setTimeout(() => {
            battle.dispatch({ type: 'endTurn', payload: { playerId: 'ai' } });
          }, 1000);
        }, 1500);
      },
      meta: {},
      tooltips: []
    },
    {
      expectedInputs: [
        {
          type: 'attack',
          payload: { playerId: 'player', unitId: 'unit_1', x: 3, y: 2, z: 0 }
        },
        {
          type: 'attack',
          payload: { playerId: 'player', unitId: 'unit_3', x: 3, y: 2, z: 0 }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Your footman only has 2HP left ! If you attacked my general with it, he would counterattack and destroy it.',
          canClickNext: true
        },
        {
          text: 'To avoid this, attack him with your general, then your footman.',
          canClickNext: false
        }
      ]
    },
    {
      expectedInputs: [
        {
          type: 'runeResourceAction',
          payload: { playerId: 'player', rune: RUNES.RED.id as any }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: "Good job ! Now, let's learn how to play cards.",
          canClickNext: true
        },
        {
          text: 'The cards in your hand appear on the bottom of the screen, while mine are at the top, face down.',
          canClickNext: true,
          onEnter() {
            tutorial.isHandDisplayed = true;
            tutorial.isOpponentHandDisplayed = true;
          }
        },
        {
          text: 'To play cards, you need to have enough gold.',
          canClickNext: true
        },
        {
          text: 'The gold cost of a unit it displayed on the top left of the card.',
          canClickNext: true
        },
        {
          text: 'The amount of gold you currently have is dislayed on the top left of the screen',
          canClickNext: true,
          onEnter() {
            tutorial.isGoldResourcesDisplayed = true;
            tutorial.highlightedElementId = 'player_player_gold';
          },
          onLeave() {
            tutorial.highlightedElementId = null;
          }
        },
        {
          text: 'Try to play the highlighted card in your hand by dragging it on the board.',
          canClickNext: false,
          onEnter(next) {
            tutorial.highlightedElementId = 'hand_card_4';
            const onClick = () => {
              next();
              tutorial.highlightedElement?.removeEventListener(
                'click',
                onClick
              );
            };
            tutorial.highlightedElement?.addEventListener('click', onClick);
          },
          onLeave() {
            tutorial.highlightedElementId = null;
          }
        },
        {
          text: "It didn't work ! That is because you are missing some RUNES.",
          canClickNext: true
        },
        {
          text: 'There are five types of runes that you can gain over the course of the game to play cards.',
          canClickNext: true,
          onEnter() {
            tutorial.isRuneResourcesDisplayed = true;
          }
        },
        {
          text: 'You can add a rune of your choice once per turn. Unlike gold, runes are not spent when playing cards: they are unlocked for the rest of the game.',
          canClickNext: true,
          onEnter() {
            tutorial.isRuneActionEnabled = true;
          }
        },
        {
          text: 'The card you were trying to play required one red rune, and a second of any color. Try to gain a second red rune.',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedElementId = 'rune_action_red';
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
          type: 'playCard',
          payload: {
            playerId: 'player',
            index: 4,
            targets: [{ x: 2, y: 1, z: 0 }]
          }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Nice, you should now be able to play your Berserk.',
          canClickNext: true
        },
        {
          text: 'Drag the card to the highlighted tile to play it',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedCell = { x: 2, y: 1, z: 0 };
            tutorial.highlightedElementId = 'hand_card_4';
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
          type: 'playCard',
          payload: {
            playerId: 'player',
            index: 3,
            targets: [{ x: 3, y: 2, z: 0 }]
          }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'The position of your general on the board is very important. You can only play other units nearby him.',
          canClickNext: true
        },
        {
          text: 'The same reasoning goes for the next type of card: Spell Cards. Most of them have a range based on your general position.',
          canClickNext: true
        },
        {
          text: '"Fireball" is a card that deals damage to a unit on the board. try to use it on the enemy general',
          canClickNext: true,
          onEnter() {
            tutorial.highlightedElementId = 'hand_card_3';
            tutorial.highlightedCell = { x: 3, y: 2, z: 0 };
          },
          onLeave() {
            tutorial.highlightedElementId = null;
            tutorial.highlightedCell = null;
          }
        }
      ]
    },
    {
      expectedInputs: [{ type: 'endTurn', payload: { playerId: 'player' } }],
      meta: {},
      tooltips: [
        {
          text: "My general's HP are getting low ! I should be careful or you will gain a lot of VICTORY POINTS !",
          canClickNext: true,
          onLeave() {
            tutorial.highlightedElementId = null;
            tutorial.highlightedCell = null;
          }
        },
        {
          text: 'Victory Points (VP) are how you win a game or Worselyst. The first player to reach 12 VP wins the game !',
          canClickNext: true
        },
        {
          text: 'The current VP score of both players is displayed on the top of the screen',
          canClickNext: true,
          onEnter() {
            tutorial.isVPDisplayed = true;
          }
        },
        {
          text: 'Victory points can be acquired in three different ways : Destroying the enemy general, Victory Shrines and Quest Cards.',
          canClickNext: true
        },
        {
          text: "Let's explore that on the next turn. Plase and your turn for now.",
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
        { type: 'endTurn', payload: { playerId: 'ai' } },
        {
          type: 'goldResourceAction',
          payload: { playerId: 'player' }
        }
      ],
      meta: {},
      tooltips: [
        { text: 'Let me end my turn as well', canClickNext: true },
        {
          text: 'It seems that you draw a powerful card ! It deals 8 damage to a general!',
          canClickNext: true,
          async onEnter() {
            await waitFor(100);
            battle.dispatch({
              type: 'endTurn',
              payload: { playerId: 'ai' }
            });
            await waitFor(500);
          }
        },
        {
          text: "You don't have enough gold to play it tough. But all hope is not lost !",
          canClickNext: true
        },
        {
          text: "If you don't need to gain any more rune, you have 2 other resource actions available each turn: getting one additional goal, or drawing an additional card.",
          canClickNext: true,
          onEnter() {
            tutorial.isGoldActionEnabled = true;
            tutorial.isDrawActionEnabled = true;
          }
        },
        {
          text: 'Use your resource action to gain enough gold to play your freshly drawn card.',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedElementId = 'gold-action-button';
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
          type: 'playCard',
          payload: {
            playerId: 'player',
            index: 3,
            targets: [{ x: 3, y: 2, z: 0 }]
          }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Now play the card and get rid of my general for some juicy Victory points !',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedElementId = 'hand_card_3';
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
          payload: { playerId: 'player', unitId: 'unit_4', x: 1, y: 1, z: 0 }
        },
        {
          type: 'endTurn',
          payload: { playerId: 'player' }
        }
      ],
      meta: {},
      tooltips: [
        {
          text: 'You destroyed my general and gained 6 VP !...but wait, why is it still on the board ?',
          canClickNext: true
        },
        {
          text: 'That is because when general are destroyed, they enter SPIRIT FORM.',
          canClickNext: true
        },
        {
          text: 'While in spirit form, generals can still play cards and move, but they cannot attack or be attacked anymore.',
          canClickNext: true
        },
        {
          text: "You are 6 VP away from victory. Now let's learn about shrines.",
          canClickNext: true,
          onLeave() {
            tutorial.areObstaclesDisplayed = true;
          }
        },
        {
          text: 'Victory shrines are a special kind of tile that will grant 1 VP to the owner of the unit standing on it at the start of their turn.',
          canClickNext: true
        },
        {
          text: "It's important to note that it will not work if the unit standing on a shrine is a general !",
          canClickNext: true
        },
        {
          text: 'Move your berserk unit on the Victory Shrine and end your turn.',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedCell = { x: 1, y: 1, z: 0 };
            until(() => ui.selectedUnit?.id === 'unit_4')
              .toBeTruthy()
              .then(() => {
                tutorial.highlightedCell = { x: 1, y: 1, z: 0 };
              });
          }
        }
      ]
    },
    {
      expectedInputs: [
        { type: 'endTurn', payload: { playerId: 'ai' } },
        {
          type: 'playCard',
          payload: {
            playerId: 'player',
            index: 3,
            targets: [{ x: 2, y: 2, z: 0 }]
          }
        },
        { type: 'endTurn', payload: { playerId: 'player' } }
      ],
      meta: {},
      tooltips: [
        {
          text: 'Let me end my turn as well',
          canClickNext: true
        },
        {
          text: 'It is your turn again, and you gain one more VP thanks to the shrine, only  5 points away from victory !',
          canClickNext: true,
          async onEnter() {
            await waitFor(100);
            battle.dispatch({
              type: 'endTurn',
              payload: { playerId: 'ai' }
            });
            await waitFor(500);
          }
        },
        {
          text: 'You draw a card that will allow you to win this turn: a QUEST CARD',
          canClickNext: true
        },
        {
          text: 'Quest card allow you to fulfill some objectives to earn rewards such a VP.',
          canClickNext: true,
          onEnter() {
            tutorial.isQuestsDisplayed = true;
          }
        },
        {
          text: 'You can have up to 2 ongoing quests at once.',
          canClickNext: true
        },
        {
          text: "The quest you drew requires you to simply end your turn. Don't expect quest cards to be that easy in real games !",
          canClickNext: true
        },
        {
          text: 'Play your quest card to reach 12VP, then end your turn to win the game !',
          canClickNext: false,
          onEnter() {
            tutorial.highlightedElementId = 'hand_card_3';
            tutorial.highlightedCell = { x: 2, y: 2, z: 0 };
          }
        }
      ],
      onLeave() {
        isFinished.value = true;
      }
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

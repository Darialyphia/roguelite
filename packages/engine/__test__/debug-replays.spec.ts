import { expect, test } from 'vitest';
import { Game, type GameOptions } from '../src/game/game';
import type { SerializedInput } from '../src/input/input-system';
import { ServerRngSystem } from '../src/rng/server-rng.system';

const options: GameOptions = {
  id: 'SERVER',
  rngCtor: ServerRngSystem,
  rngSeed: 'sandbox_1737776375508',
  mapId: '1v1',
  teams: [
    [
      {
        id: 'player1',
        name: 'Player 1',
        deck: {
          altar: {
            blueprintId: 'altar'
          },
          cards: [
            {
              blueprintId: 'red-blood-cultist-brute'
            },
            {
              blueprintId: 'red-blood-cultist-brute'
            },
            {
              blueprintId: 'red-blood-cultist-brute'
            },
            {
              blueprintId: 'red-blood-cultist-devotee'
            },
            {
              blueprintId: 'red-blood-cultist-devotee'
            },
            {
              blueprintId: 'red-blood-cultist-devotee'
            },
            {
              blueprintId: 'red-blood-cultist-flagbearer'
            },
            {
              blueprintId: 'red-blood-cultist-flagbearer'
            },
            {
              blueprintId: 'red-blood-cultist-flagbearer'
            },
            {
              blueprintId: 'red-blood-cultist-priestess'
            },
            {
              blueprintId: 'red-blood-cultist-priestess'
            },
            {
              blueprintId: 'red-blood-cultist-priestess'
            },
            {
              blueprintId: 'red-crazed-blood-cultist'
            },
            {
              blueprintId: 'red-crazed-blood-cultist'
            },
            {
              blueprintId: 'red-crazed-blood-cultist'
            },
            {
              blueprintId: 'red-exorcist'
            },
            {
              blueprintId: 'red-exorcist'
            },
            {
              blueprintId: 'red-fire-elemental'
            },
            {
              blueprintId: 'red-fire-elemental'
            },
            {
              blueprintId: 'red-warleader'
            },
            {
              blueprintId: 'red-warleader'
            },
            {
              blueprintId: 'red-bloodlust'
            },
            {
              blueprintId: 'red-bloodlust'
            },
            {
              blueprintId: 'red-bloodlust'
            },
            {
              blueprintId: 'red-footman'
            },
            {
              blueprintId: 'red-footman'
            },
            {
              blueprintId: 'red-footman'
            },
            {
              blueprintId: 'red-footman'
            },
            {
              blueprintId: 'red-avenger'
            },
            {
              blueprintId: 'red-avenger'
            }
          ]
        }
      }
    ],
    [
      {
        id: 'player2',
        name: 'Player 2',
        deck: {
          altar: {
            blueprintId: 'altar'
          },
          cards: [
            {
              blueprintId: 'red-flame-lord'
            },
            {
              blueprintId: 'red-flame-lord'
            },
            {
              blueprintId: 'red-flame-lord'
            },
            {
              blueprintId: 'red-pyromancer'
            },
            {
              blueprintId: 'red-pyromancer'
            },
            {
              blueprintId: 'red-pyromancer'
            },
            {
              blueprintId: 'red-fire-elemental'
            },
            {
              blueprintId: 'red-fire-elemental'
            },
            {
              blueprintId: 'red-fire-elemental'
            },
            {
              blueprintId: 'red-will-o-wisp'
            },
            {
              blueprintId: 'red-will-o-wisp'
            },
            {
              blueprintId: 'red-will-o-wisp'
            },
            {
              blueprintId: 'red-combustion'
            },
            {
              blueprintId: 'red-combustion'
            },
            {
              blueprintId: 'red-combustion'
            },
            {
              blueprintId: 'red-immolation'
            },
            {
              blueprintId: 'red-immolation'
            },
            {
              blueprintId: 'red-immolation'
            },
            {
              blueprintId: 'red-avenger'
            },
            {
              blueprintId: 'red-avenger'
            },
            {
              blueprintId: 'red-fireball'
            },
            {
              blueprintId: 'red-fireball'
            },
            {
              blueprintId: 'red-fireball'
            },
            {
              blueprintId: 'red-footman'
            },
            {
              blueprintId: 'red-footman'
            },
            {
              blueprintId: 'red-footman'
            },
            {
              blueprintId: 'red-warleader'
            },
            {
              blueprintId: 'red-exorcist'
            },
            {
              blueprintId: 'red-exorcist'
            },
            {
              blueprintId: 'red-exorcist'
            }
          ]
        }
      }
    ]
  ],
  configOverrides: {}
};

const history: SerializedInput[] = [
  {
    type: 'mulligan',
    payload: {
      playerId: 'player1',
      indices: []
    }
  },
  {
    type: 'mulligan',
    payload: {
      playerId: 'player2',
      indices: []
    }
  },
  {
    type: 'runeResourceAction',
    payload: {
      playerId: 'player1',
      rune: 'RED'
    }
  },
  {
    type: 'endTurn',
    payload: {
      playerId: 'player1'
    }
  },
  {
    type: 'runeResourceAction',
    payload: {
      playerId: 'player2',
      rune: 'RED'
    }
  },
  {
    type: 'endTurn',
    payload: {
      playerId: 'player2'
    }
  },
  {
    type: 'runeResourceAction',
    payload: {
      playerId: 'player1',
      rune: 'RED'
    }
  },
  {
    type: 'playCard',
    payload: {
      playerId: 'player1',
      index: 0,
      targets: [
        {
          x: 3,
          y: 4,
          z: 1
        },
        {
          x: 8,
          y: 5,
          z: 1
        }
      ]
    }
  },
  {
    type: 'endTurn',
    payload: {
      playerId: 'player1'
    }
  },
  {
    type: 'runeResourceAction',
    payload: {
      playerId: 'player2',
      rune: 'RED'
    }
  },
  {
    type: 'playCard',
    payload: {
      playerId: 'player2',
      index: 1,
      targets: [
        {
          x: 7,
          y: 5,
          z: 1
        },
        {
          x: 3,
          y: 4,
          z: 1
        }
      ]
    }
  },
  {
    type: 'endTurn',
    payload: {
      playerId: 'player2'
    }
  },
  {
    type: 'move',
    payload: {
      playerId: 'player1',
      unitId: 'unit_3',
      x: 4,
      y: 2,
      z: 1
    }
  },
  {
    type: 'drawResourceAction',
    payload: {
      playerId: 'player1'
    }
  },
  {
    type: 'endTurn',
    payload: {
      playerId: 'player1'
    }
  },
  {
    type: 'playCard',
    payload: {
      playerId: 'player2',
      index: 3,
      targets: [
        {
          x: 8,
          y: 6,
          z: 1
        }
      ]
    }
  },
  {
    type: 'runeResourceAction',
    payload: {
      playerId: 'player2',
      rune: 'RED'
    }
  },
  {
    type: 'move',
    payload: {
      playerId: 'player2',
      unitId: 'unit_4',
      x: 6,
      y: 3,
      z: 1
    }
  },
  {
    type: 'endTurn',
    payload: {
      playerId: 'player2'
    }
  },
  {
    type: 'playCard',
    payload: {
      playerId: 'player1',
      index: 2,
      targets: [
        {
          x: 4,
          y: 2,
          z: 1
        }
      ]
    }
  }
];

test('debug', () => {
  const game = new Game(options);

  game.initialize();
  history.forEach(step => {
    game.dispatch(step);
  });

  expect(true).toBe(true);
});

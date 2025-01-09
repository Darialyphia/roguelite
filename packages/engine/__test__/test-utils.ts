import { createEntityId } from '../src/entity';
import { Game, type GameOptions } from '../src/game/game';
import { ServerRngSystem } from '../src/rng/server-rng.system';

export const testGameBuilder = () => {
  const options: Partial<GameOptions> = {};

  return {
    withMapId(id: string) {
      options.mapId = id;
      return this;
    },
    withSeed(seed: string) {
      options.rngSeed = seed;
      return this;
    },
    withP1Deck(deck: GameOptions['teams'][number][number]['deck']) {
      options.teams ??= [[], []];
      options.teams[0] = [
        {
          deck,
          id: '',
          name: ''
        }
      ];
      return this;
    },
    withP2Deck(deck: GameOptions['teams'][number][number]['deck']) {
      options.teams ??= [[], []];
      options.teams[1] = [
        {
          deck,
          id: '',
          name: ''
        }
      ];
      return this;
    },
    build() {
      const game = new Game({
        id: 'test',
        mapId: options.mapId ?? '1v1',
        rngCtor: ServerRngSystem,
        rngSeed: options.rngSeed ?? 'test',
        teams: [
          [
            {
              id: 'p1',
              name: 'Player 1',
              deck: options.teams?.[0][0]?.deck ?? {
                general: { blueprintId: 'red-general-flame-lord' },
                cards: []
              }
            }
          ],
          [
            {
              id: 'p2',
              name: 'Player 2',
              deck: options.teams?.[1][0]?.deck ?? {
                general: { blueprintId: 'red-general-flame-lord' },
                cards: []
              }
            }
          ]
        ]
      });

      game.initialize();

      return {
        game,
        team1: game.playerSystem.teams[0],
        team2: game.playerSystem.teams[1],
        player1: game.playerSystem.getPlayerById(createEntityId('p1'))!,
        player2: game.playerSystem.getPlayerById(createEntityId('p2'))!
      };
    }
  };
};

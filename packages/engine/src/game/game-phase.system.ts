import { assert, type Values } from '@game/shared';
import { StateMachine, t } from 'typescript-fsm';
import { System } from '../system';
import { GAME_EVENTS } from './game';

export const GAME_PHASES = {
  DEPLOYMENT: 'deployment',
  BATTLE: 'battle',
  END: 'end'
} as const;
export type GamePhase = Values<typeof GAME_PHASES>;

export const GAME_PHASE_TRANSITIONS = {
  START_BATTLE: 'start_battle',
  END_BATTLE: 'end_battle'
} as const;
export type GamePhaseTransition = Values<typeof GAME_PHASE_TRANSITIONS>;

export class GamePhaseSystem extends System<never> {
  private stateMachine = new StateMachine<GamePhase, GamePhaseTransition>(
    GAME_PHASES.DEPLOYMENT,
    [
      t(GAME_PHASES.DEPLOYMENT, GAME_PHASE_TRANSITIONS.START_BATTLE, GAME_PHASES.BATTLE),
      t(GAME_PHASES.BATTLE, GAME_PHASE_TRANSITIONS.END_BATTLE, GAME_PHASES.END)
    ]
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initialize(): void {}

  get phase() {
    return this.stateMachine.getState();
  }

  startBattle() {
    assert(
      this.stateMachine.can(GAME_PHASE_TRANSITIONS.START_BATTLE),
      `Cannot enter phase ${GAME_PHASES.BATTLE} from phase ${this.phase}`
    );

    this.stateMachine.dispatch(GAME_PHASE_TRANSITIONS.START_BATTLE);
    this.game.playerSystem.players.forEach(player => player.deploy());
    this.game.emit(GAME_EVENTS.START_BATTLE);
    this.game.turnSystem.startGameTurn();
  }

  endBattle() {
    assert(
      this.stateMachine.can(GAME_PHASE_TRANSITIONS.END_BATTLE),
      `Cannot enter phase ${GAME_PHASES.END} from phase ${this.phase}`
    );

    this.stateMachine.dispatch(GAME_PHASE_TRANSITIONS.END_BATTLE);
    this.game.emit(GAME_EVENTS.END_BATTLE);
  }
}
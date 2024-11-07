import type { AnyFunction, Constructor, Nullable, Values } from '@game/shared';
import type { Game } from '../game';
import type { DefaultSchema, Input, SerializedInput } from './input';
import { MoveInput } from './inputs/move.input';
import { AttackInput } from './inputs/attack.input';
import { PlayCardInput } from './inputs/play-card.input';
import { System } from '../system';
import { DeployInput } from './inputs/deploy.input';

type GenericInputMap = Record<string, Constructor<Input<DefaultSchema>>>;

type ValidatedInputMap<T extends GenericInputMap> = {
  [Name in keyof T]: T[Name] extends Constructor<Input<DefaultSchema>>
    ? Name extends InstanceType<T[Name]>['name']
      ? T[Name]
      : never
    : never;
};

const validateinputMap = <T extends GenericInputMap>(data: ValidatedInputMap<T>) => data;

const inputMap = validateinputMap({
  move: MoveInput,
  attack: AttackInput,
  playCard: PlayCardInput,
  deploy: DeployInput
});

export type InputSystemOptions = { game: Game };
export class InputSystem extends System<SerializedInput[]> {
  private history: Input<any>[] = [];

  private isRunning = false;

  private queue: AnyFunction[] = [];

  private _currentAction?: Nullable<InstanceType<Values<typeof inputMap>>> = null;

  constructor(game: Game) {
    super(game);
  }

  get currentAction() {
    return this._currentAction;
  }

  initialize(rawHistory: SerializedInput[]) {
    for (const action of rawHistory) {
      this.schedule(() => this.handleInput(action));
    }
  }

  private isActionType(type: string): type is keyof typeof inputMap {
    return Object.keys(inputMap).includes(type);
  }

  schedule(fn: AnyFunction) {
    this.queue.push(fn);
    if (!this.isRunning) {
      this.flushSchedule();
    }
  }

  private flushSchedule() {
    if (this.isRunning) {
      console.warn('already flushing !');
      return;
    }
    this.isRunning = true;
    try {
      while (this.queue.length) {
        const fn = this.queue.shift();
        fn!();
      }
      this.isRunning = false;
      this.game.emit('game.input-queue-flushed');
    } catch (err) {
      console.error(err);
      this.game.emit('game.error', { error: err as Error });
    }
  }

  dispatch({ type, payload }: SerializedInput) {
    if (!this.isActionType(type)) return;
    return this.schedule(() => this.handleInput({ type, payload }));
  }

  handleInput({ type, payload }: SerializedInput) {
    if (!this.isActionType(type)) return;
    // this.session.logger(`%c[ACTION:${type}]`, 'color: blue', payload);
    const ctor = inputMap[type];
    const action = new ctor(this.game, payload);
    this._currentAction = action;
    action.execute();
    this.history.push(action);
    this._currentAction = null;
  }

  getHistory() {
    return [...this.history];
  }

  serialize() {
    return this.history.map(action => action.serialize());
  }
}

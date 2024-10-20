import type { AnyFunction, Constructor, Nullable, Values } from '@game/shared';
import type { Game } from '../game';
import { TestInput } from './inputs/test.input';
import type { DefaultSchema, Input, SerializedInput } from './input';

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
  test: TestInput
});

export type InputSystemOptions = { game: Game };
export class InputSystem {
  private history: Input<any>[] = [];

  private isRunning = false;

  private scheduledInputs: AnyFunction[] = [];

  private _currentAction?: Nullable<InstanceType<Values<typeof inputMap>>> = null;

  constructor(private game: Game) {}

  get currentAction() {
    return this._currentAction;
  }

  setup(rawHistory: SerializedInput[]) {
    for (const action of rawHistory) {
      this.schedule(() => this.handleAction(action));
    }
  }

  private isActionType(type: string): type is keyof typeof inputMap {
    return Object.keys(inputMap).includes(type);
  }

  schedule(fn: AnyFunction) {
    this.scheduledInputs.push(fn);
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
      while (this.scheduledInputs.length) {
        const fn = this.scheduledInputs.shift();
        fn!();
      }
      this.isRunning = false;
    } catch (err) {
      console.error(err);
      // this.game.emit('game:error', err as Error);
    }
  }

  dispatch({ type, payload }: SerializedInput) {
    if (!this.isActionType(type)) return;
    return this.schedule(() => this.handleAction({ type, payload }));
  }

  handleAction({ type, payload }: SerializedInput) {
    if (!this.isActionType(type)) return;
    // this.session.logger(`%c[ACTION:${type}]`, 'color: blue', payload);
    const ctor = inputMap[type];
    const action = new ctor(payload);
    this._currentAction = action;
    action.execute(this.game);
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

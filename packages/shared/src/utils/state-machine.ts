import type { AnyFunction } from '../types/utils';

export type Callback = AnyFunction | undefined;

export interface ITransition<STATE, EVENT, CALLBACK> {
  fromState: STATE;
  event: EVENT;
  toState: STATE;
  cb?: CALLBACK;
}

export function t<STATE, EVENT, CALLBACK>(
  fromState: STATE,
  event: EVENT,
  toState: STATE,
  cb?: CALLBACK
): ITransition<STATE, EVENT, CALLBACK> {
  return { fromState, event, toState, cb };
}

type ILogger = Partial<typeof console> & { error(...data: unknown[]): void };

export class StateMachine<
  TState extends string | number | symbol,
  TEvent extends string | number | symbol,
  TCallback extends Record<TEvent, Callback> = Record<TEvent, Callback>
> {
  protected _current: TState;

  // initialize the state-machine
  constructor(
    _init: TState,
    protected transitions: ITransition<
      TState,
      TEvent,
      TCallback[TEvent]
    >[] = [],
    protected readonly logger: ILogger = console
  ) {
    this._current = _init;
  }

  addTransitions(
    transitions: ITransition<TState, TEvent, TCallback[TEvent]>[]
  ): void {
    // bind any unbound method
    transitions.forEach(_tran => {
      const tran: ITransition<TState, TEvent, TCallback[TEvent]> =
        Object.create(_tran);
      if (tran.cb && !tran.cb.name?.startsWith('bound ')) {
        //@ts-expect-error
        tran.cb = tran.cb.bind(this);
      }
      this.transitions.push(tran);
    });
  }

  getState(): TState {
    return this._current;
  }

  can(event: TEvent): boolean {
    return this.transitions.some(
      trans => trans.fromState === this._current && trans.event === event
    );
  }

  getNextState(event: TEvent): TState | undefined {
    const transition = this.transitions.find(
      tran => tran.fromState === this._current && tran.event === event
    );
    return transition?.toState;
  }

  isFinal(): boolean {
    // search for a transition that starts from current state.
    // if none is found it's a terminal state.
    return this.transitions.every(trans => trans.fromState !== this._current);
  }

  // post event async
  dispatch<E extends TEvent>(
    event: E,
    ...args: TCallback[E] extends AnyFunction
      ? Parameters<TCallback[E]>
      : never[]
  ): void {
    const transition = this.transitions.find(transition => {
      return (
        transition.fromState === this._current && transition.event === event
      );
    });

    if (!transition) {
      const errorMessage = this.#formatNoTransitionError(this._current, event);
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this._current = transition.toState;
    if (transition.cb) {
      try {
        transition.cb(...args);
      } catch (e) {
        this.logger.error('Exception caught in callback', e);
      }
    }
  }

  #formatNoTransitionError(fromState: TState, event: TEvent) {
    return `No transition: from ${String(fromState)} event ${String(event)}`;
  }
}

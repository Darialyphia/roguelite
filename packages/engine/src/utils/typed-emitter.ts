import EventEmitter2 from 'eventemitter2';

type PrefixedEvents<T extends string, TEventMap extends Record<string, any>, TCtx> = {
  [Event in keyof TEventMap as `${T}.${Event extends string ? Event : ''}`]: [
    TEventMap[Event][0] & TCtx
  ];
};

export class TypedEventEmitter<TEvents extends Record<string, any>> {
  private emitter = new EventEmitter2();

  constructor() {
    this.emitter.setMaxListeners(99999);
  }

  removeAllListeners() {
    this.emitter.removeAllListeners();
  }

  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: TEvents[TEventName]
  ) {
    return this.emitter.emit(eventName, ...(eventArg as []));
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ) {
    this.emitter.on(eventName, handler as any);

    return () => this.off(eventName, handler);
  }

  once<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ) {
    this.emitter.once(eventName, handler as any);

    return () => this.off(eventName, handler);
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ) {
    this.emitter.off(eventName, handler as any);
  }

  forward<
    TPrefix extends string,
    TCtx,
    TEventMap extends PrefixedEvents<TPrefix, TEvents, TCtx>
  >(
    emitter: TypedEventEmitter<TEventMap>,
    ns: string,
    events: Array<string & keyof TEvents>,
    ctx: () => TCtx
  ) {
    events.forEach(eventName => {
      this.emitter.on(eventName, e => {
        // @ts-expect-error
        emitter.emit(`${ns}.${eventName}`, { ...e, ...ctx() });
      });
    });
  }
}

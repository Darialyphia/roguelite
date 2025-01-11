import type { AnyObject, MaybePromise } from '@game/shared';
import type { SerializedInput } from './input/input-system';
import {
  ClientSession,
  type ClientDispatchMeta,
  type ClientSessionOptions
} from './client-session';
import { GAME_EVENTS } from './game/game';
import deepEqual from 'deep-equal';

export type TutorialStep = {
  expectedInputs: SerializedInput[];
  tooltips: Array<{
    text: string;
    canClickNext: boolean;
    onEnter?: (next: () => void) => MaybePromise<void>;
    onLeave?: () => MaybePromise<void>;
  }>;
  onEnter?: (session: TutorialSession) => void;
  onLeave?: (session: TutorialSession) => void;
  meta: AnyObject;
};

export type TutorialSessionOptions = ClientSessionOptions & {
  steps: TutorialStep[];
};

export class TutorialSession extends ClientSession {
  readonly steps: TutorialStep[];

  private currentStepIndex = 0;
  private currentInputIndex = 0;
  isFinished = false;

  get currentStep() {
    return this.steps[this.currentStepIndex];
  }

  get currentExpectedInput() {
    return this.currentStep.expectedInputs[this.currentInputIndex];
  }

  constructor(options: TutorialSessionOptions) {
    super(options);
    this.steps = options.steps;
  }

  initialize(rngValues: number[]): void {
    super.initialize(rngValues);
    this.game.on(GAME_EVENTS.INPUT_START, () => {
      if (this.isFinished) return;
      this.next();
    });
    // this.currentStep.onEnter?.(this);
  }

  next() {
    this.currentInputIndex++;
    console.log('Session.next', this.currentInputIndex, this.currentExpectedInput);
    if (this.currentExpectedInput) return;

    this.currentStep.onLeave?.(this);
    this.currentStepIndex++;
    this.currentInputIndex = 0;
    if (!this.currentStep) {
      this.isFinished = true;
    } else {
      this.currentStep.onEnter?.(this);
    }
  }

  dispatch(input: SerializedInput, meta: ClientDispatchMeta): void {
    const isValid = this.isFinished || deepEqual(input, this.currentExpectedInput);
    if (!isValid) {
      console.error(
        'Wrong tutorial input received. Expected',
        this.currentExpectedInput,
        'received',
        input
      );
      return;
    }

    super.dispatch(input, meta);
  }
}

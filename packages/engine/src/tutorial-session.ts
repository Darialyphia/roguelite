import type { MaybePromise } from '@game/shared';
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
};

export type TutorialSessionOptions = ClientSessionOptions & {
  steps: TutorialStep[];
  onInvalidInput: (input: SerializedInput, expected: SerializedInput) => void;
};

export class TutorialSession extends ClientSession {
  readonly steps: TutorialStep[];

  private currentStepIndex = 0;
  private currentInputIndex = 0;
  private onInvalidInput: (input: SerializedInput, expected: SerializedInput) => void;
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
    this.onInvalidInput = options.onInvalidInput;
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

  validate(input: SerializedInput) {
    const isValid = this.isFinished || deepEqual(input, this.currentExpectedInput);
    if (!isValid) this.onInvalidInput(input, this.currentExpectedInput);

    return isValid;
  }

  dispatch(input: SerializedInput, meta: ClientDispatchMeta): void {
    const isValid = this.validate(input);
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

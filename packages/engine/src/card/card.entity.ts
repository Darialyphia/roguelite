import { assert, type Point3D, type Values } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import { isQuestBlueprint, type CardBlueprint } from './card-blueprint';
import type { Game } from '../game/game';
import type { Player } from '../player/player.entity';
import type { VFXSequence } from '../vfx/vfx-sequencer';
import { TypedEventEmitter } from '../utils/typed-emitter';

export type CardOptions = {
  id: string;
  blueprint: CardBlueprint;
};

export const CARD_EVENTS = {
  BEFORE_PLAY: 'before_play',
  AFTER_PLAY: 'after_play'
} as const;

export type CardEvent = Values<typeof CARD_EVENTS>;

export type CardEventMap = {
  [CARD_EVENTS.BEFORE_PLAY]: [{ vfx: VFXSequence; targets: Point3D[] }];
  [CARD_EVENTS.AFTER_PLAY]: [{ vfx: VFXSequence; targets: Point3D[] }];
};

export abstract class Card<
  TBlueprint extends CardBlueprint = CardBlueprint
> extends Entity {
  protected game: Game;

  protected blueprint: TBlueprint;

  protected emitter = new TypedEventEmitter<CardEventMap>();

  readonly player: Player;

  constructor(game: Game, player: Player, options: CardOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.player = player;
    // @ts-expect-error
    this.blueprint = options.blueprint;
  }

  get on() {
    return this.emitter.on.bind(this.emitter);
  }

  get once() {
    return this.emitter.once.bind(this.emitter);
  }

  get off() {
    return this.emitter.off.bind(this.emitter);
  }

  get blueprintId() {
    return this.blueprint.id;
  }

  get kind() {
    return this.blueprint.kind;
  }

  get iconId() {
    return this.blueprint.iconId;
  }

  get name() {
    return this.blueprint.name;
  }

  get description() {
    return this.blueprint.description;
  }

  get cost() {
    return this.blueprint.cost;
  }

  get minTargets() {
    return this.blueprint.minTargets;
  }

  get maxTargets() {
    return this.blueprint.targets.length;
  }

  get targetsDefinition() {
    return this.blueprint.targets;
  }

  get shouldHighlightInHand() {
    return this.blueprint.shouldHighlightInHand?.(this.game, this) ?? false;
  }

  get aiHints() {
    return this.blueprint.aiHints;
  }

  abstract play(targets: Point3D[]): void;

  abstract get canPlay(): boolean;

  isWithinRange(point: Point3D, index: number) {
    if (index >= this.blueprint.targets.length) return false;
    return (
      this.blueprint.targets[index]
        // @ts-expect-error
        .getTargeting(this.game, this)
        .isWithinRange(point)
    );
  }

  areTargetsValid(targets: Point3D[]) {
    const bp = this.blueprint;

    assert(targets.length <= bp.targets.length, 'Cannot play card: too many targets.');

    return targets.every((target, index) => {
      // @ts-expect-error
      const targeting = bp.targets[index].getTargeting(this.game, this);
      const unit = this.game.unitSystem.getUnitAt(target);
      if (unit && !unit.canBeCardTarget) return false;

      return targeting.canTargetAt(target);
    });
  }

  getAoe(targets: Point3D[]) {
    if (isQuestBlueprint(this.blueprint)) return null;
    if (!this.areTargetsValid(targets)) {
      return null;
    }
    return this.blueprint.getAoe(this.game, this as any, targets);
  }

  canPlayAt(targets: Point3D[]) {
    if (targets.length < this.minTargets) {
      return false;
    }
    return this.canPlay && this.areTargetsValid(targets);
  }

  shutdown() {
    this.emitter.removeAllListeners();
  }
}

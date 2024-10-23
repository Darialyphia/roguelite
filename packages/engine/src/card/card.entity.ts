import type { Point3D, Serializable } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { CardBlueprint } from './card-blueprint';
import type { Unit } from '../unit/unit.entity';
import type { Game } from '../game';

export type SerializedCard = {
  id: string;
};

export type CardOptions = {
  id: string;
  unit: Unit;
  blueprint: CardBlueprint;
};

export class Card extends Entity implements Serializable<SerializedCard> {
  private game: Game;

  private blueprint: CardBlueprint;

  readonly unit: Unit;

  constructor(game: Game, options: CardOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.unit = options.unit;
    this.blueprint = options.blueprint;
  }

  get cost() {
    return this.blueprint.cost;
  }

  serialize(): SerializedCard {
    return { id: this.id };
  }

  play(targets: Point3D[]) {
    this.blueprint.onPlay(this.game, this, targets);
  }

  canPlayAt(targets: Point3D[]) {
    if (targets.length > this.blueprint.targets.length) {
      throw new Error('Cannot play card: too many targets.');
    }
    if (targets.length < this.blueprint.minTargets) {
      throw new Error('Cannot play card: not enough targets.');
    }

    return targets.every((target, index) => {
      const targeting = this.blueprint.targets[index].getTargeting(this.game, this);

      return targeting.canTargetAt(target);
    });
  }
}

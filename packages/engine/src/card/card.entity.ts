import { assert, type Point3D } from '@game/shared';
import { createEntityId, Entity } from '../entity';
import type { CardBlueprint } from './card-blueprint';
import type { Unit } from '../unit/unit.entity';
import type { Game } from '../game/game';

export type CardOptions = {
  id: string;
  blueprint: CardBlueprint;
};

export class Card extends Entity {
  private game: Game;

  private blueprint: CardBlueprint;

  readonly unit: Unit;

  constructor(game: Game, unit: Unit, options: CardOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.unit = unit;
    this.blueprint = options.blueprint;
  }

  get cost() {
    return this.blueprint.cost;
  }

  get name() {
    return this.blueprint.name;
  }

  get description() {
    return this.blueprint.description;
  }

  play(targets: Point3D[]) {
    this.blueprint.onPlay(this.game, this, targets);
  }

  canPlayAt(targets: Point3D[]) {
    assert(
      targets.length <= this.blueprint.targets.length,
      'Cannot play card: too many targets.'
    );
    assert(
      targets.length >= this.blueprint.minTargets,
      'Cannot play card: not enough targets.'
    );

    return targets.every((target, index) => {
      const targeting = this.blueprint.targets[index].getTargeting(this.game, this);

      return targeting.canTargetAt(target);
    });
  }
}

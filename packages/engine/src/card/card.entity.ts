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

  get blueprintId() {
    return this.blueprint.id;
  }

  get cost() {
    return this.blueprint.cost;
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

  get minTargets() {
    return this.blueprint.minTargets;
  }

  get maxTargets() {
    return this.blueprint.targets.length;
  }

  get targetsDefinition() {
    return this.blueprint.targets;
  }

  get aiHints() {
    return this.blueprint.aiHints;
  }

  play(targets: Point3D[]) {
    if (!this.canPlayAt(targets)) return;
    const aoeShape = this.blueprint.getAoe(this.game, this, targets);

    this.blueprint.onPlay(this.game, this, aoeShape.getCells(), aoeShape.getUnits());
  }

  isWithinRange(point: Point3D, index: number) {
    if (index >= this.blueprint.targets.length) return false;

    return this.blueprint.targets[index]
      .getTargeting(this.game, this)
      .isWithinRange(point);
  }

  areTargetsValid(targets: Point3D[]) {
    assert(
      targets.length <= this.blueprint.targets.length,
      'Cannot play card: too many targets.'
    );

    return targets.every((target, index) => {
      const targeting = this.blueprint.targets[index].getTargeting(this.game, this);
      return targeting.canTargetAt(target);
    });
  }

  getAoe(targets: Point3D[]) {
    if (!this.areTargetsValid(targets)) {
      return null;
    }
    return this.blueprint.getAoe(this.game, this, targets);
  }

  canPlayAt(targets: Point3D[]) {
    assert(
      targets.length >= this.blueprint.minTargets,
      'Cannot play card: not enough targets.'
    );

    return this.areTargetsValid(targets);
  }
}

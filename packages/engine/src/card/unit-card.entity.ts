import { type Point3D } from '@game/shared';
import type { Unit } from '../unit/unit.entity';
import { Card, CARD_EVENTS } from './card.entity';
import type { UnitCardBlueprint } from './card-blueprint';

export class UnitCard extends Card<UnitCardBlueprint> {
  unit!: Unit;

  get cost() {
    return this.blueprint.cost;
  }

  get jobs() {
    return this.blueprint.jobs;
  }

  get atk() {
    return this.blueprint.atk;
  }

  get maxHp() {
    return this.blueprint.maxHp;
  }

  get reward() {
    return this.blueprint.reward;
  }

  get speed() {
    return this.blueprint.speed;
  }

  get spriteId() {
    return this.blueprint.spriteId;
  }

  get canPlay() {
    return (
      this.player.canSpendGold(this.cost.gold) &&
      this.player.hasUnlockedRunes(this.cost.runes)
    );
  }

  get attackPattern() {
    return this.blueprint.getAttackPattern(this.game, this.unit);
  }

  play(targets: Point3D[]) {
    if (!this.canPlayAt(targets)) return;

    this.emitter.emit(CARD_EVENTS.BEFORE_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });

    this.player.spendGold(this.blueprint.cost.gold);

    const [summonPosition] = targets;
    this.unit = this.game.unitSystem.addUnit(this, summonPosition);

    const aoeShape = this.blueprint.getAoe(this.game, this, targets);
    this.blueprint.onPlay(this.game, this, aoeShape.getCells(), aoeShape.getUnits());

    this.emitter.emit(CARD_EVENTS.AFTER_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });
  }
}

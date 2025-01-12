import { assert, type Point3D } from '@game/shared';
import type { Unit } from '../unit/unit.entity';
import { Card, CARD_EVENTS } from './card.entity';
import type { UnitCardBlueprint } from './card-blueprint';
import { UNIT_TYPES } from './card-enums';
import { TARGETING_TYPE } from '../targeting/targeting-strategy';
import { MeleeTargetingStrategy } from '../targeting/melee-targeting.straegy';

export class UnitCard extends Card<UnitCardBlueprint> {
  unit!: Unit;

  get jobs() {
    return this.blueprint.jobs;
  }

  get atk() {
    return this.blueprint.atk;
  }

  get maxHp() {
    return this.blueprint.maxHp;
  }

  get unitType() {
    return this.blueprint.unitType;
  }

  get spriteId() {
    return this.blueprint.spriteId;
  }

  get isGoldValid() {
    return this.player.canSpendGold(this.cost.gold);
  }

  get isRunesValid() {
    return this.player.hasUnlockedRunes(this.cost.runes);
  }

  get canPlay() {
    // probably not the cleaest way to bypass card playing contraints for general
    if (this.unitType === UNIT_TYPES.GENERAL) return true;

    return (
      this.game.turnSystem.activePlayer.equals(this.player) &&
      this.isGoldValid &&
      this.isRunesValid
    );
  }

  get attackPattern() {
    return new MeleeTargetingStrategy(
      this.game,
      this.unit,
      TARGETING_TYPE.ENEMY_UNIT,
      false
    );
  }

  play(targets: Point3D[]) {
    if (this.unitType !== UNIT_TYPES.GENERAL) {
      assert(this.canPlayAt(targets), 'cannot play card at this position.');
    }

    const [summonPosition] = targets;
    this.unit = this.game.unitSystem.addUnit(this, summonPosition);

    this.emitter.emit(CARD_EVENTS.BEFORE_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });

    this.player.spendGold(this.blueprint.cost.gold);

    const aoeShape = this.blueprint.getAoe(this.game, this, targets);
    this.blueprint.onPlay(
      this.game,
      this,
      aoeShape.getCells(targets),
      aoeShape.getUnits(targets)
    );

    if (this.unit.shouldDeactivateWhenSummoned) {
      this.unit.deactivate();
    }

    this.emitter.emit(CARD_EVENTS.AFTER_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });
  }
}

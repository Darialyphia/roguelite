import type { Unit } from '../unit/unit.entity';
import { Card } from './card.entity';
import type { GeneralCardBlueprint } from './card-blueprint';

export class GeneralCard extends Card<GeneralCardBlueprint> {
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
    return true;
  }

  get attackPattern() {
    return this.blueprint.getAttackPattern(this.game, this.unit);
  }

  play() {
    this.unit = this.game.unitSystem.addUnit(this, this.player.startPosition);

    this.blueprint.onPlay(this.game, this);
  }
}

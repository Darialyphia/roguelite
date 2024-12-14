import { type Point3D } from '@game/shared';
import { Card, CARD_EVENTS } from './card.entity';
import type { SpellCardBlueprint } from './card-blueprint';

export class SpellCard extends Card<SpellCardBlueprint> {
  get cost() {
    return this.blueprint.cost;
  }

  get isJobValid() {
    return this.blueprint.cost.job.some(job =>
      this.game.turnSystem.activeUnit.card.jobs.includes(job)
    );
  }

  get isApValid() {
    return this.game.turnSystem.activeUnit.canSpendAp(this.cost.ap);
  }

  get isRunesValid() {
    return this.player.hasUnlockedRunes(this.cost.runes);
  }

  get canPlay() {
    return (
      this.game.turnSystem.activeUnit.player.equals(this.player) &&
      this.isApValid &&
      this.isJobValid &&
      this.isRunesValid
    );
  }

  play(targets: Point3D[]) {
    if (!this.canPlayAt(targets)) return;

    this.emitter.emit(CARD_EVENTS.BEFORE_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });
    this.game.turnSystem.activeUnit.ap.remove(this.blueprint.cost.ap);
    const aoeShape = this.blueprint.getAoe(this.game, this, targets);
    this.blueprint.onPlay(
      this.game,
      this,
      aoeShape.getCells(targets),
      aoeShape.getUnits(targets)
    );
    this.emitter.emit(CARD_EVENTS.AFTER_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });
  }
}

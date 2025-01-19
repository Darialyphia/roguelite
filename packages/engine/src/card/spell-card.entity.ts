import { type Point3D } from '@game/shared';
import { Card, CARD_EVENTS } from './card.entity';
import type { SpellCardBlueprint } from './card-blueprint';
import { CARD_KINDS } from './card-enums';

export const isSpellCard = (card: Card): card is SpellCard =>
  card.kind === CARD_KINDS.SPELL;

export class SpellCard extends Card<SpellCardBlueprint> {
  get isGoldValid() {
    return this.player.canSpendGold(this.cost.gold);
  }

  get isRunesValid() {
    return this.player.hasUnlockedRunes(this.cost.runes);
  }

  get canPlay() {
    return (
      this.game.turnSystem.activePlayer.equals(this.player) &&
      this.isGoldValid &&
      this.isRunesValid
    );
  }

  play(targets: Point3D[], ignoreRequirements?: boolean) {
    if (!this.canPlayAt(targets) && !ignoreRequirements) return;

    this.emitter.emit(CARD_EVENTS.BEFORE_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });

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

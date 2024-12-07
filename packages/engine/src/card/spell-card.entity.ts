import { type Point3D } from '@game/shared';
import { Card } from './card.entity';
import type { SpellCardBlueprint } from './card-blueprint';

export class SpellCard extends Card<SpellCardBlueprint> {
  get cost() {
    return this.blueprint.cost;
  }

  get canPlay() {
    return (
      this.game.turnSystem.activeUnit.player.equals(this.player) &&
      this.game.turnSystem.activeUnit.canSpendAp(this.cost.ap) &&
      this.player.hasUnlockedRunes(this.cost.runes)
    );
  }

  play(targets: Point3D[]) {
    if (!this.canPlayAt(targets)) return;

    this.game.turnSystem.activeUnit.ap.remove(this.blueprint.cost.ap);
    const aoeShape = this.blueprint.getAoe(this.game, this, targets);
    this.blueprint.onPlay(this.game, this, aoeShape.getCells(), aoeShape.getUnits());
  }
}

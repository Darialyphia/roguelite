import { type AnyObject, type Point3D } from '@game/shared';
import { Card, CARD_EVENTS } from './card.entity';
import type { QuestCardBlueprint } from './card-blueprint';

export class QuestCard extends Card<QuestCardBlueprint> {
  get cost() {
    return this.blueprint.cost;
  }

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
      this.isRunesValid &&
      this.player.quests.size < this.game.config.MAX_ONGOING_QUESTS
    );
  }

  meta: AnyObject = {};

  play(targets: Point3D[]) {
    if (!this.canPlayAt(targets)) return;

    this.emitter.emit(CARD_EVENTS.BEFORE_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });
    this.blueprint.onPlay(this.game, this);
    this.player.quests.add(this);
    this.emitter.emit(CARD_EVENTS.AFTER_PLAY, {
      targets,
      vfx: this.blueprint.vfx.play(this.game, this)
    });
  }

  complete() {
    this.blueprint.onCompleted(this.game, this);
    this.player.quests.delete(this);
  }
}

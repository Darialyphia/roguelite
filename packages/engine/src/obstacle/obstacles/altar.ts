import { config } from '../../config';
import { HealthComponent } from '../../unit/components/health.component';
import type { ObstacleBlueprint } from '../obstacle-blueprint';

export const altar: ObstacleBlueprint = {
  id: 'altar',
  name: 'Altar',
  description: `Allows it owner to deploy units nearby it. Destroying it awards ${config.ALTAR_VP_REWARD} Vicory Points.`,
  spriteId: 'altar',
  iconId: 'obstacle_altar',
  walkable: false,
  attackable: true,
  onCreated(game, obstacle) {
    obstacle.meta.hp = new HealthComponent({
      maxHp: config.ALTAR_HP
    });
    obstacle.meta.isDestroyed = false;
  },
  onAttacked(game, obstacle, unit) {
    const hp = obstacle.meta.hp as HealthComponent;
    hp.remove(unit.getDealtDamage(unit.atk), unit.card);
    if (hp.current === 0) obstacle.destroy();
    obstacle.meta.isDestroyed = true;
    obstacle.isAttackable = false;
  }
};

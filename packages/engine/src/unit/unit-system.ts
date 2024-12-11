import { isDefined, type Point3D } from '@game/shared';
import type { EntityId } from '../entity';
import { Unit } from './unit.entity';
import { System } from '../system';
import { GAME_PHASES } from '../game/game-phase.system';
import type { UnitCard } from '../card/unit-card.entity';
import type { GeneralCard } from '../card/general-card.entity';
import { UNIT_EVENTS } from './unit-enums';

// eslint-disable-next-line @typescript-eslint/ban-types
export type UnitSystemOptions = {};

export class UnitSystem extends System<UnitSystemOptions> {
  private unitMap = new Map<EntityId, Unit>();

  private nextUnitId = 0;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initialize() {}

  shutdown() {
    this.units.forEach(unit => unit.shutdown());
  }

  get units() {
    return [...this.unitMap.values()];
  }

  getUnitById(id: EntityId) {
    return this.unitMap.get(id) ?? null;
  }

  getUnitAt(position: Point3D) {
    return (
      this.units.find(e => {
        return e.isAt(position);
      }) ?? null
    );
  }

  getNearbyUnits({ x, y, z }: Point3D) {
    // prettier-ignore
    return [
      // Same level
      this.getUnitAt({ x: x - 1, y: y - 1, z }), // top left
      this.getUnitAt({ x: x    , y: y - 1, z }), // top
      this.getUnitAt({ x: x + 1, y: y - 1, z }), // top right
      this.getUnitAt({ x: x - 1, y: y    , z}),  // left
      this.getUnitAt({ x: x + 1, y: y    , z}),  // right
      this.getUnitAt({ x: x - 1, y: y + 1, z }), // bottom left
      this.getUnitAt({ x: x    , y: y + 1, z }), // bottom
      this.getUnitAt({ x: x + 1, y: y + 1, z }), // bottom right,

      // below
      this.getUnitAt({ x: x - 1, y: y - 1, z: z - 1 }), // top left
      this.getUnitAt({ x: x    , y: y - 1, z: z - 1 }), // top
      this.getUnitAt({ x: x + 1, y: y - 1, z: z - 1 }), // top right
      this.getUnitAt({ x: x - 1, y: y    , z: z - 1 }), // left
      this.getUnitAt({ x: x    , y: y    , z: z - 1 }), // center
      this.getUnitAt({ x: x + 1, y: y    , z: z - 1 }), // right
      this.getUnitAt({ x: x - 1, y: y + 1, z: z - 1 }), // bottom left
      this.getUnitAt({ x: x    , y: y + 1, z: z - 1 }), // bottom
      this.getUnitAt({ x: x + 1, y: y + 1, z: z - 1 }), // bottom right,

      // Above
      this.getUnitAt({ x: x - 1, y: y - 1, z: z + 1 }), // top left
      this.getUnitAt({ x: x    , y: y - 1, z: z + 1 }), // top
      this.getUnitAt({ x: x + 1, y: y - 1, z: z + 1 }), // top right
      this.getUnitAt({ x: x - 1, y: y    , z: z + 1 }), // left
      this.getUnitAt({ x: x    , y: y    , z: z + 1 }), // center
      this.getUnitAt({ x: x + 1, y: y    , z: z + 1 }), // right
      this.getUnitAt({ x: x - 1, y: y + 1, z: z + 1 }), // bottom left
      this.getUnitAt({ x: x    , y: y + 1, z: z + 1 }), // bottom
      this.getUnitAt({ x: x + 1, y: y + 1, z: z + 1 }), // bottom right,
    ].filter(isDefined)
  }

  forwardListeners(unit: Unit) {
    Object.values(UNIT_EVENTS).forEach(eventName => {
      unit.on(eventName, event => {
        this.game.emit(`unit.${eventName}`, { ...event, unit } as any);
      });
    });
  }

  addUnit(card: UnitCard | GeneralCard, position: Point3D) {
    const id = `unit_${++this.nextUnitId}`;
    const unit = new Unit(this.game, card, { id, player: card.player, position });
    this.unitMap.set(unit.id, unit);
    this.forwardListeners(unit);
    unit.onAddedToBoard();

    if (this.game.phase === GAME_PHASES.BATTLE) {
      // this.game.turnSystem.insertInCurrentQueue(unit);
    }
    return unit;
  }

  removeUnit(unit: Unit) {
    this.unitMap.delete(unit.id);
  }
}

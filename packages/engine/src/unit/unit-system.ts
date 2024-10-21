import { isDefined, type Point3D, type Serializable } from '@game/shared';
import type { Entity, EntityId } from '../entity';
import { Unit, type SerializedUnit, type UnitOptions } from './unit.entity';
import { System } from '../system';

export type SerializedUnitSystem = {
  units: SerializedUnit[];
};

export type UnitSystemOptions = {
  units: UnitOptions[];
};

export class UnitSystem
  extends System<UnitSystemOptions>
  implements Serializable<SerializedUnitSystem>
{
  private unitMap = new Map<EntityId, Unit>();

  private nextUnitId = 0;

  initialize(options: UnitSystemOptions) {
    options.units.forEach(rawEntity => {
      const entity = new Unit(this.game, rawEntity);
      this.unitMap.set(entity.id, entity);
      this.setupListeners(entity);
    });
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

  setupListeners(entity: Entity) {
    // Object.values(ENTITY_EVENTS).forEach(eventName => {
    //   entity.on(eventName, event => {
    //     await this.game.emit(`entity.${eventName}`, event as any);
    //   });
    // });
  }

  addUnit(unitOptions: Omit<UnitOptions, 'id'>) {
    const id = `unit_${this.nextUnitId}`;
    const entity = new Unit(this.game, { ...unitOptions, id });
    this.unitMap.set(entity.id, entity);
    this.setupListeners(entity);

    return entity;
  }

  removeEntity(entity: Entity) {
    this.unitMap.delete(entity.id);
  }

  serialize() {
    return {
      units: this.units.map(e => e.serialize())
    };
  }
}

import { type Branded } from '@game/shared';

export type EntityId = Branded<string, 'EntityId'>;
export const createEntityId = (str: string) => str as EntityId;

export abstract class Entity {
  readonly id: EntityId;

  constructor(id: EntityId) {
    this.id = id;
  }

  equals(e: Entity) {
    return this.id == e.id;
  }
}

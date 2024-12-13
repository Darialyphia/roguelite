import { Entity, type EntityId } from '../entity';

export class Rune extends Entity {
  readonly name: string;

  constructor(id: string, name: string) {
    super(id as EntityId);
    this.name = name;
  }
}

export const RUNES = {
  RED: new Rune('RED', 'Destruction'),
  YELLOW: new Rune('YELLOW', 'Order'),
  GREEN: new Rune('GREEN', 'Creation'),
  PURPLE: new Rune('PURPLE', '  Chaos'),
  BLUE: new Rune('BLUE', 'Aether'),
  COLORLESS: new Rune('COLORLESS', 'Colorless')
} as const;

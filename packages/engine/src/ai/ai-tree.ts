import type { Game } from '../game/game';
import type { SerializedInput } from '../input/input-system';

type AITreeNode = {
  game: Game;
  input: SerializedInput;
  children: AITreeNode[];
  parent?: AITreeNode;
  isFinal: boolean;
};

export class AITree {}

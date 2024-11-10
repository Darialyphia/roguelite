import { Cell } from '@game/engine/src/board/cell';
import { defineStore } from 'pinia';
import { useBattleStore } from './battle.store';
import { type Nullable, type Point3D } from '@game/shared';

export const useInternalBattleUiStore = defineStore(
  'internal-battle-ui',
  () => {
    const hoveredCell = shallowRef<Nullable<Cell>>(null);

    return { hoveredCell };
  }
);

export const useBattleUiStore = defineStore('battle-ui', () => {
  const uiStore = useInternalBattleUiStore();
  const battleStore = useBattleStore();

  return {
    hoveredCell: computed(() => uiStore.hoveredCell),
    hoverAt(point: Point3D) {
      uiStore.hoveredCell =
        battleStore.session!.game.boardSystem.getCellAt(point);
    },
    unHover() {
      uiStore.hoveredCell = null;
    }
  };
});

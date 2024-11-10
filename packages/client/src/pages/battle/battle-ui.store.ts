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

type Parts = {
  armor: 'tier1' | 'tier2' | 'tier3' | 'tier4' | null;
  helm: 'tier1' | 'tier2' | 'tier3' | 'tier4' | null;
  weapon: 'tier1' | 'tier2' | 'tier3' | 'tier4' | null;
  vfx: 'tier1' | 'tier2' | 'tier3' | 'tier4' | null;
};

export const useBattleUiStore = defineStore('battle-ui', () => {
  const uiStore = useInternalBattleUiStore();
  const battleStore = useBattleStore();

  const parts = ref<Parts>({
    armor: 'tier1',
    helm: 'tier1',
    weapon: 'tier1',
    vfx: 'tier1'
  });

  return {
    parts,
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

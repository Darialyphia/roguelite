import { Cell } from '@game/engine/src/board/cell';
import { defineStore } from 'pinia';
import { useBattleStore } from './battle.store';
import { type Nullable, type Point3D, type Values } from '@game/shared';
import { StateMachine, t } from 'typescript-fsm';
import type { Game } from '@game/engine';
import type { InputDispatcher } from '@game/engine/src/input/input-system';
import { type UnitViewModel, makeUnitVModel } from '@/unit/unit.model';

export const UI_MODES = {
  BASIC: 'basic',
  SELECT_CARD_TARGETS: 'select_card_targets'
} as const;
export type UiMode = Values<typeof UI_MODES>;

export const UI_MODE_TRANSITIONS = {
  SELECT_CARD: 'select_card',
  UNSELECT_CARD: 'unselect_card'
} as const;
export type UiModeTransition = Values<typeof UI_MODE_TRANSITIONS>;

export class UiModeManager {
  private game: Game;
  private dispatcher: InputDispatcher;

  constructor(game: Game, dispatcher: InputDispatcher) {
    this.game = game;
    this.dispatcher = dispatcher;
  }

  private stateMachine = new StateMachine<UiMode, UiModeTransition>(
    UI_MODES.BASIC,
    [
      t(
        UI_MODES.BASIC,
        UI_MODE_TRANSITIONS.SELECT_CARD,
        UI_MODES.SELECT_CARD_TARGETS
      ),
      t(
        UI_MODES.SELECT_CARD_TARGETS,
        UI_MODE_TRANSITIONS.UNSELECT_CARD,
        UI_MODES.BASIC
      )
    ]
  );

  get mode() {
    return this.stateMachine.getState();
  }
}

export const useInternalBattleUiStore = defineStore(
  'internal-battle-ui',
  () => {
    const store = useBattleStore();
    const hoveredCell = shallowRef<Nullable<Cell>>(null);
    const highlightedUnit = ref<Nullable<UnitViewModel>>(null);

    watch(hoveredCell, cell => {
      if (!store.session) return;
      if (cell?.unit) {
        highlightedUnit.value = makeUnitVModel(
          store.session.game as Game, // vue issue when unwrappign Refs containign  a class instance
          cell.unit
        );
      }
    });

    return { hoveredCell, highlightedUnit };
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
      uiStore.highlightedUnit = null;
    },

    highlightedUnit: computed(() => uiStore.highlightedUnit),
    highlightUnit(unit: UnitViewModel) {
      uiStore.highlightedUnit = unit;
    },
    unhighlight() {
      uiStore.highlightedUnit = null;
    }
  };
});

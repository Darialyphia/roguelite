import { Cell } from '@game/engine/src/board/cell';
import { defineStore } from 'pinia';
import { useBattleStore } from './battle.store';
import {
  assert,
  isDefined,
  type Nullable,
  type Point3D,
  type Values
} from '@game/shared';
import { StateMachine, t } from '@game/shared';
import type { Game } from '@game/engine';
import { type UnitViewModel, makeUnitViewModel } from '@/unit/unit.model';
import { whenever } from '@vueuse/core';
import { makeCardViewModel, type CardViewModel } from '@/card/card.model';
import { Layer } from '@pixi/layers';
import { match } from 'ts-pattern';
import type { DisplayObject } from 'pixi.js';
import type { CellViewModel } from '@/board/models/cell.model';

export const UI_MODES = {
  BASIC: 'basic',
  PLAY_CARD: 'play_card'
} as const;
export type UiMode = Values<typeof UI_MODES>;

export const UI_MODE_TRANSITIONS = {
  SELECT_CARD: 'select_card',
  UNSELECT_CARD: 'unselect_card'
} as const;
export type UiModeTransition = Values<typeof UI_MODE_TRANSITIONS>;

type UiModeContext =
  | {
      mode: (typeof UI_MODES)['BASIC'];
    }
  | {
      mode: (typeof UI_MODES)['PLAY_CARD'];
      card: CardViewModel;
      cardIndex: number;
      targets: Point3D[];
    };

export class UiModeManager {
  private game: Game;
  private selectedCardIndex: Nullable<number> = null;
  private cardTargets: Nullable<Point3D[]> = null;

  constructor(game: Game) {
    this.game = game;
  }

  private stateMachine = new StateMachine<UiMode, UiModeTransition>(
    UI_MODES.BASIC,
    [
      t(UI_MODES.BASIC, UI_MODE_TRANSITIONS.SELECT_CARD, UI_MODES.PLAY_CARD),
      t(UI_MODES.PLAY_CARD, UI_MODE_TRANSITIONS.UNSELECT_CARD, UI_MODES.BASIC)
    ]
  );

  getSelectedCard() {
    if (!isDefined(this.selectedCardIndex)) return null;

    return this.game.turnSystem.activePlayer.getCardAt(this.selectedCardIndex);
  }

  get mode() {
    return this.stateMachine.getState();
  }

  selectCardAtIndex(index: number) {
    this.stateMachine.dispatch(UI_MODE_TRANSITIONS.SELECT_CARD);

    this.selectedCardIndex = index;
    this.cardTargets = [];
  }

  unselectCard() {
    this.stateMachine.dispatch(UI_MODE_TRANSITIONS.UNSELECT_CARD);

    this.selectedCardIndex = null;
    this.cardTargets = [];
  }

  addTarget(target: Point3D) {
    assert(
      this.mode === UI_MODES.PLAY_CARD,
      `cannot add card taget in mode ${this.mode}`
    );
    this.cardTargets!.push(target);
  }

  getContext(): UiModeContext {
    return match(this.mode)
      .with(UI_MODES.BASIC, mode => ({
        mode
      }))
      .with(UI_MODES.PLAY_CARD, mode => ({
        mode,
        card: makeCardViewModel(this.game, this.getSelectedCard()!),
        cardIndex: this.selectedCardIndex!,
        targets: this.cardTargets!
      }))
      .exhaustive();
  }
}

export const useInternalBattleUiStore = defineStore(
  'internal-battle-ui',
  () => {
    const store = useBattleStore();
    const hoveredCell = shallowRef<Nullable<Cell>>(null);
    const highlightedUnit = ref<Nullable<UnitViewModel>>(null);
    const selectedUnitId = ref<Nullable<string>>(null);

    watch(hoveredCell, cell => {
      if (!store.session) return;
      if (cell?.unit) {
        highlightedUnit.value = makeUnitViewModel(
          store.session.game as Game, // vue issue when unwrapping Refs containign  a class instance
          cell.unit
        );
      }
    });

    return { hoveredCell, highlightedUnit, selectedUnitId };
  }
);

export const useBattleUiStore = defineStore('battle-ui', () => {
  const uiStore = useInternalBattleUiStore();
  const battleStore = useBattleStore();

  let modeManager: UiModeManager | null = null;
  const modeContext = ref<UiModeContext>();

  whenever(
    () => battleStore.session?.game,
    game => {
      modeManager = new UiModeManager(game as Game);
      modeContext.value = modeManager.getContext();
    },
    { immediate: true }
  );

  const isBoardAppearAnimationDone = ref(false);

  type LayerName = 'ui' | 'scene' | 'fx';

  const layers: Record<LayerName, Ref<Layer | undefined>> = {
    ui: ref(),
    scene: ref(),
    fx: ref()
  };

  const validCardTargets = ref(new Set<string>());
  const getValidTargets = () => {
    validCardTargets.value.clear();
    battleStore.state.cells.forEach(cell => {
      try {
        if (modeContext.value?.mode !== UI_MODES.PLAY_CARD) {
          return;
        }
        const isValid = modeContext.value.card.areTargetsValid([
          ...modeContext.value.targets,
          cell
        ]);
        if (isValid) {
          validCardTargets.value.add(`${cell.x}:${cell.y}:${cell.z}`);
        }
      } catch {}
    });
  };

  watchEffect(() => {
    getValidTargets();
  });

  return {
    isBoardAppearAnimationDone,
    registerLayer(layer: Layer, name: LayerName) {
      if (!layer) return;
      layers[name].value = layer;
      layer.group.enableSort = true;
      layer.sortableChildren = true;
    },
    assignLayer(obj: Nullable<DisplayObject>, name: LayerName) {
      if (!isDefined(obj)) return;
      obj.parentLayer = layers[name].value;
    },
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
    unhighlightUnit() {
      uiStore.highlightedUnit = null;
    },

    selectedUnit: computed(() =>
      battleStore.state.units.find(unit => unit.id === uiStore.selectedUnitId)
    ),
    selectUnit(unit: UnitViewModel) {
      uiStore.selectedUnitId = unit.id;
    },
    unselectUnit() {
      uiStore.selectedUnitId = null;
    },

    mode: computed(() => modeContext.value?.mode),

    selectCardAtIndex(index: number) {
      modeManager?.selectCardAtIndex(index);
      modeContext.value = modeManager?.getContext();
    },
    unselectCard() {
      modeManager?.unselectCard();
      modeContext.value = modeManager?.getContext();
    },
    addCardTarget(point: Point3D) {
      modeManager?.addTarget(point);
      modeContext.value = modeManager?.getContext();
    },
    canPlayCard() {
      if (modeContext.value?.mode !== UI_MODES.PLAY_CARD) {
        return false;
      }
      return modeContext.value.card.canPlayAt(modeContext.value.targets);
    },
    isTargetValid(point: Point3D) {
      return validCardTargets.value.has(`${point.x}:${point.y}:${point.z}`);
    },
    selectedCard: computed(() => {
      if (modeContext.value?.mode !== UI_MODES.PLAY_CARD) {
        return null;
      }
      return modeContext.value.card;
    }),
    selectedCardIndex: computed(() => {
      if (modeContext.value?.mode !== UI_MODES.PLAY_CARD) {
        return null;
      }
      return modeContext.value.cardIndex;
    }),
    cardTargets: computed(() => {
      if (modeContext.value?.mode !== UI_MODES.PLAY_CARD) {
        return [];
      }
      return modeContext.value.targets;
    })
  };
});

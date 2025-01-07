import { createEntityId, Entity, type EntityId } from '../entity';
import type { Team } from './team.entity';
import { GAME_EVENTS, type Game } from '../game/game';
import { CardManagerComponent } from '../card/card-manager.component';
import type { Card, CardOptions } from '../card/card.entity';
import { GoldManagerComponent } from './components/gold-manager.component';
import { config } from '../config';
import { DECK_EVENTS } from '../card/deck.entity';
import { assert, type Point3D, type Values } from '@game/shared';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { RuneManager } from './components/rune-manager.component';
import { match } from 'ts-pattern';
import { Rune, RUNES } from '../utils/rune';
import type { QuestCard } from '../card/quest-card.entity';
import { EventTrackerComponent } from './components/event-tracker.component';
import type { SerializedInput } from '../input/input-system';
import type { UnitCard } from '../card/unit-card.entity';
import { createCard } from '../card/card-factory';
import type { Unit } from '../unit/unit.entity';

export type PlayerOptions = {
  id: string;
  name: string;
  deck: { general: CardOptions; cards: CardOptions[] };
  generalPosition: Point3D;
};

export const PLAYER_EVENTS = {
  BEFORE_DRAW: 'before_draw',
  AFTER_DRAW: 'after_draw',
  START_TURN: 'start_turn',
  END_TURN: 'end_turn',
  BEFORE_GAIN_RUNE: 'before_gain_rune',
  AFTER_GAIN_RUNE: 'after_gain_rune',
  BEFORE_GAIN_GOLD: 'before_gain_gold',
  AFTER_GAIN_GOLD: 'after_gain_gold',
  BEFORE_PLAY_CARD: 'before_play_card',
  AFTER_PLAY_CARD: 'after_play_card'
} as const;

export type PlayerEvent = Values<typeof PLAYER_EVENTS>;
export type PlayerEventMap = {
  [PLAYER_EVENTS.START_TURN]: [{ id: EntityId }];
  [PLAYER_EVENTS.END_TURN]: [{ id: EntityId }];
  [PLAYER_EVENTS.BEFORE_DRAW]: [{ amount: number }];
  [PLAYER_EVENTS.AFTER_DRAW]: [{ cards: Card[] }];
  [PLAYER_EVENTS.BEFORE_GAIN_RUNE]: [{ rune: Rune }];
  [PLAYER_EVENTS.AFTER_GAIN_RUNE]: [{ rune: Rune }];
  [PLAYER_EVENTS.BEFORE_GAIN_GOLD]: [{ amount: number }];
  [PLAYER_EVENTS.AFTER_GAIN_GOLD]: [{ amount: number }];
  [PLAYER_EVENTS.BEFORE_PLAY_CARD]: [{ card: Card; targets: Point3D[] }];
  [PLAYER_EVENTS.AFTER_PLAY_CARD]: [{ card: Card; targets: Point3D[] }];
};

type ResourceAction = SerializedInput & {
  type: 'drawResourceAction' | 'goldResourceAction' | 'runeResourceAction';
};

export class Player extends Entity {
  private game: Game;

  readonly team: Team;

  readonly name: string;

  private readonly cardManager: CardManagerComponent;

  private readonly goldManager: GoldManagerComponent;

  private readonly eventTracker: EventTrackerComponent;

  private readonly runeManager: RuneManager;

  readonly generalPosition: Point3D;

  private emitter = new TypedEventEmitter<PlayerEventMap>();

  public mulliganIndices: number[] = [];

  public hasMulliganed = false;

  private resourceActionsTaken = 0;

  lastResourceActionTaken: ResourceAction | null = null;

  readonly quests = new Set<QuestCard>();

  general!: Unit;

  acquiredGeneralRewards = {
    half: false,
    full: false
  };

  constructor(game: Game, team: Team, options: PlayerOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.team = team;
    this.name = options.name;
    this.generalPosition = options.generalPosition;
    this.eventTracker = new EventTrackerComponent(this.game, this);
    this.runeManager = new RuneManager();
    this.cardManager = new CardManagerComponent(this.game, this, {
      deck: options.deck.cards
    });
    this.goldManager = new GoldManagerComponent(config.INITIAL_GOLD);
    this.forwardEvents();
    this.draw(config.INITIAL_HAND_SIZE);
    this.game.on(GAME_EVENTS.START_BATTLE, this.onBattleStart.bind(this));
    this.placeGeneral(options.deck.general);
  }

  shutdown() {
    this.emitter.removeAllListeners();
    this.cardManager.shutdown();
  }

  get on() {
    return this.emitter.on.bind(this.emitter);
  }

  get once() {
    return this.emitter.once.bind(this.emitter);
  }

  get off() {
    return this.emitter.off.bind(this.emitter);
  }

  get allyDiedLastTurn() {
    return this.eventTracker.allyDiedLastTurn;
  }

  get enemyDiedLastTurn() {
    return this.eventTracker.enemyDiedLastTurn;
  }

  get gold() {
    return this.goldManager.amount;
  }

  private placeGeneral(options: CardOptions) {
    const generalCard = createCard(this.game, this, options) as UnitCard;
    generalCard.play([this.generalPosition]);
    this.general = generalCard.unit;
    assert(this.general.isGeneral, 'General unit type needs to be a general');
  }

  addGold(amount: number) {
    this.emitter.emit(PLAYER_EVENTS.BEFORE_GAIN_GOLD, { amount });
    this.goldManager.deposit(amount);
    this.emitter.emit(PLAYER_EVENTS.AFTER_GAIN_GOLD, { amount });
  }

  get spendGold() {
    return this.goldManager.spend.bind(this.goldManager);
  }

  get runes() {
    return this.runeManager.runes;
  }

  addRune(rune: Rune) {
    this.emitter.emit(PLAYER_EVENTS.BEFORE_GAIN_RUNE, { rune });
    this.runeManager.add(rune);
    this.emitter.emit(PLAYER_EVENTS.AFTER_GAIN_RUNE, { rune });
  }

  get removeRune() {
    return this.runeManager.remove.bind(this.runeManager);
  }

  get canSpendGold() {
    return this.goldManager.canSpend.bind(this.goldManager);
  }

  get canPerformResourceAction(): boolean {
    return this.resourceActionsTaken < config.MAX_RESOURCE_ACTION_PER_TURN;
  }

  get hasUnlockedRunes() {
    return this.runeManager.hasUnlocked.bind(this.runeManager);
  }

  get getMissingRunes() {
    return this.runeManager.getMissing.bind(this.runeManager);
  }

  get hand() {
    return [...this.cardManager.hand];
  }

  get deck() {
    return this.cardManager.deck;
  }

  get deckSize() {
    return this.cardManager.deckSize;
  }

  get remainingCardsInDeck() {
    return this.cardManager.remainingCardsInDeck;
  }

  get getCardAt() {
    return this.cardManager.getCardAt.bind(this.cardManager);
  }

  get draw() {
    return this.cardManager.draw.bind(this.cardManager);
  }

  get opponents() {
    return this.game.playerSystem.players.filter(player => this.isEnemy(player));
  }

  isAlly(player: Player) {
    return player.team.equals(this.team);
  }

  isEnemy(player: Player) {
    return !player.team.equals(this.team);
  }

  get units() {
    return this.game.unitSystem.units.filter(u => u.player.equals(this));
  }

  get enemyUnits() {
    return this.game.unitSystem.units.filter(u => !u.player.equals(this));
  }

  get enemiesPositions(): Point3D[] {
    return [
      ...this.enemyUnits.map(e => e.position),
      ...this.opponents.map(o => o.generalPosition)
    ];
  }

  private forwardEvents() {
    this.cardManager.deck.on(DECK_EVENTS.BEFORE_DRAW, e => {
      this.emitter.emit(DECK_EVENTS.BEFORE_DRAW, e);
    });
    this.cardManager.deck.on(DECK_EVENTS.AFTER_DRAW, e => {
      this.emitter.emit(DECK_EVENTS.AFTER_DRAW, e);
    });
  }

  performResourceAction(action: ResourceAction) {
    this.resourceActionsTaken++;
    this.lastResourceActionTaken = action;
    match(action)
      .with({ type: 'drawResourceAction' }, () => {
        this.draw(1);
      })
      .with({ type: 'goldResourceAction' }, () => {
        this.goldManager.deposit(1);
      })
      .with({ type: 'runeResourceAction' }, action => {
        this.addRune(RUNES[action.payload.rune as keyof typeof RUNES]);
      })
      .exhaustive();
  }

  mulligan() {
    for (const index of this.mulliganIndices) {
      this.cardManager.replaceCardAt(index);
    }
  }

  canPlayCardAt(index: number) {
    const card = this.getCardAt(index);
    if (!card) return false;

    return card.canPlay;
  }

  playCard(index: number, targets: Point3D[]) {
    const card = this.cardManager.getCardAt(index);
    if (!card) return;
    this.emitter.emit(PLAYER_EVENTS.BEFORE_PLAY_CARD, { card, targets });
    this.cardManager.play(card, targets);
    this.emitter.emit(PLAYER_EVENTS.AFTER_PLAY_CARD, { card, targets });
  }

  startTurn() {
    this.resourceActionsTaken = 0;
    this.draw(config.CARDS_DRAWN_PER_TURN);
    this.addGold(config.GOLD_PER_TURN);
    this.emitter.emit(PLAYER_EVENTS.START_TURN, { id: this.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onBattleStart() {}

  triggerGeneralHalfReward() {
    if (this.acquiredGeneralRewards.half) return;

    this.acquiredGeneralRewards.half = true;
    this;
    this.opponents[0].team.earnVictoryPoints(this.game.config.GENERAL_VP_HALF_REWARD);
  }

  triggerGeneralFullReward() {
    if (this.acquiredGeneralRewards.full) return;

    this.acquiredGeneralRewards.full = true;
    this;
    this.opponents[0].team.earnVictoryPoints(this.game.config.GENERAL_VP_FULL_REWARD);
  }

  endTurn() {
    this.emitter.emit(PLAYER_EVENTS.END_TURN, { id: this.id });
  }
}

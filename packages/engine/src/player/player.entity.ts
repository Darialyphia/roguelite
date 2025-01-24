import { createEntityId, Entity, type EntityId } from '../entity';
import type { Team } from './team.entity';
import { GAME_EVENTS, type Game } from '../game/game';
import { CardManagerComponent } from '../card/card-manager.component';
import { CARD_EVENTS, type Card, type CardOptions } from '../card/card.entity';
import { GoldManagerComponent } from './components/gold-manager.component';
import { DECK_EVENTS } from '../card/deck.entity';
import { assert, type Point3D } from '@game/shared';
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
import { PLAYER_EVENTS } from './player-enums';
import { makeCardId } from '../card/card.utils';
import { CARDS_DICTIONARY } from '../card/cards/_index';

export type PlayerOptions = {
  id: string;
  name: string;
  deck: { altar: CardOptions; cards: CardOptions[] };
  altarPosition: Point3D;
};

export type PlayerEventMap = {
  [PLAYER_EVENTS.START_TURN]: [{ id: EntityId }];
  [PLAYER_EVENTS.END_TURN]: [{ id: EntityId }];
  [PLAYER_EVENTS.BEFORE_DRAW]: [{ amount: number }];
  [PLAYER_EVENTS.AFTER_DRAW]: [{ cards: Card[] }];
  [PLAYER_EVENTS.BEFORE_RUNE_CHANGE]: [{ rune: Rune }];
  [PLAYER_EVENTS.AFTER_RUNE_CHANGE]: [{ rune: Rune }];
  [PLAYER_EVENTS.BEFORE_VP_CHANGE]: [{ amount: number }];
  [PLAYER_EVENTS.AFTER_VP_CHANGE]: [{ amount: number }];
  [PLAYER_EVENTS.BEFORE_GOLD_CHANGE]: [{ amount: number }];
  [PLAYER_EVENTS.AFTER_GOLD_CHANGE]: [{ amount: number }];
  [PLAYER_EVENTS.BEFORE_PLAY_CARD]: [{ card: Card; targets: Point3D[] }];
  [PLAYER_EVENTS.AFTER_PLAY_CARD]: [{ card: Card; targets: Point3D[] }];
  [PLAYER_EVENTS.MULLIGAN]: [{ id: EntityId }];
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

  readonly altarPosition: Point3D;

  private emitter = new TypedEventEmitter<PlayerEventMap>();

  public mulliganIndices: number[] = [];

  public hasMulliganed = false;

  private resourceActionsTaken = 0;

  lastResourceActionTaken: ResourceAction | null = null;

  readonly quests = new Set<QuestCard>();

  altar!: Unit;

  constructor(game: Game, team: Team, options: PlayerOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.team = team;
    this.name = options.name;
    this.altarPosition = options.altarPosition;
    this.eventTracker = new EventTrackerComponent(this.game, this);
    this.runeManager = new RuneManager();
    this.cardManager = new CardManagerComponent(this.game, this, {
      deck: options.deck.cards,
      maxHandSize: this.game.config.MAX_HAND_SIZE,
      shouldShuffleDeck: this.game.config.SHUFFLE_DECK_ON_GAME_START
    });
    this.goldManager = new GoldManagerComponent(this.game.config.INITIAL_GOLD);
    this.forwardEvents();
    this.draw(this.game.config.INITIAL_HAND_SIZE);
    this.game.on(GAME_EVENTS.START_BATTLE, this.onBattleStart.bind(this));
    this.placeAltar(options.deck.altar);
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

  private placeAltar(options: CardOptions) {
    const altarCard = createCard(this.game, this, options) as UnitCard;
    altarCard.play([this.altarPosition]);
    this.altar = altarCard.unit;
  }

  addGold(amount: number) {
    this.emitter.emit(PLAYER_EVENTS.BEFORE_GOLD_CHANGE, { amount });
    this.goldManager.deposit(amount);
    this.emitter.emit(PLAYER_EVENTS.AFTER_GOLD_CHANGE, { amount });
  }

  get spendGold() {
    return this.goldManager.spend.bind(this.goldManager);
  }

  get runes() {
    return this.runeManager.runes;
  }

  addRune(rune: Rune) {
    this.emitter.emit(PLAYER_EVENTS.BEFORE_RUNE_CHANGE, { rune });
    this.runeManager.add(rune);
    this.emitter.emit(PLAYER_EVENTS.AFTER_RUNE_CHANGE, { rune });
  }

  get removeRune() {
    return this.runeManager.remove.bind(this.runeManager);
  }

  get canSpendGold() {
    return this.goldManager.canSpend.bind(this.goldManager);
  }

  get canPerformResourceAction(): boolean {
    return this.resourceActionsTaken < this.game.config.MAX_RESOURCE_ACTION_PER_TURN;
  }

  get hasUnlockedRunes() {
    return this.runeManager.hasUnlocked.bind(this.runeManager);
  }

  get getMissingRunes() {
    return this.runeManager.getMissing.bind(this.runeManager);
  }

  get getRuneCount() {
    return this.runeManager.getRuneCount.bind(this.runeManager);
  }

  get isActive() {
    return this.game.turnSystem.activePlayer.equals(this);
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

  get addToHand() {
    return this.cardManager.addToHand.bind(this.cardManager);
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
      ...this.opponents.map(o => o.altarPosition)
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
        this.addGold(1);
      })
      .with({ type: 'runeResourceAction' }, action => {
        this.addRune(RUNES[action.payload.rune as keyof typeof RUNES]);
      })
      .exhaustive();
  }

  commitMulliganIndices(indices: number[]) {
    this.mulliganIndices = indices;
    this.hasMulliganed = true;
    this.emitter.emit(PLAYER_EVENTS.MULLIGAN, { id: this.id });
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

  playCardAtIndex(index: number, targets: Point3D[]) {
    const card = this.cardManager.getCardAt(index);
    if (!card) return;

    this.playCard(card, targets);
  }

  playCard(card: Card, targets: Point3D[]) {
    this.emitter.emit(PLAYER_EVENTS.BEFORE_PLAY_CARD, { card, targets });
    card.once(CARD_EVENTS.BEFORE_PLAY, () => {
      this.spendGold(card.cost.gold);
    });
    this.cardManager.play(card, targets);
    this.emitter.emit(PLAYER_EVENTS.AFTER_PLAY_CARD, { card, targets });
  }

  generateCard(blueprintId: string) {
    const blueprint = CARDS_DICTIONARY[blueprintId];
    const card = createCard(this.game, this, {
      id: makeCardId(blueprint.id, this.id),
      blueprint: blueprint
    });

    return card;
  }

  generateUnit(blueprintId: string, position: Point3D) {
    const card = this.generateCard(blueprintId) as UnitCard;
    card.play([position], true);
    return card.unit;
  }

  startTurn() {
    this.resourceActionsTaken = 0;
    this.draw(this.game.config.CARDS_DRAWN_PER_TURN);
    this.addGold(this.game.config.GOLD_PER_TURN);
    this.emitter.emit(PLAYER_EVENTS.START_TURN, { id: this.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onBattleStart() {}

  triggerAltarReward() {
    this.opponents[0].team.earnVictoryPoints(this.game.config.ALTAR_VP_REWARD);
  }

  endTurn() {
    if (this.gold > this.game.config.MAX_GOLD_STOCKPILED) {
      this.goldManager.spend(this.gold - this.game.config.MAX_GOLD_STOCKPILED);
    }

    this.emitter.emit(PLAYER_EVENTS.END_TURN, { id: this.id });
  }

  onBeforeTeamVPChange(amount: number) {
    this.emitter.emit(PLAYER_EVENTS.BEFORE_VP_CHANGE, { amount });
  }

  onAfterTeamVPChange(amount: number) {
    this.emitter.emit(PLAYER_EVENTS.AFTER_VP_CHANGE, { amount });
  }
}

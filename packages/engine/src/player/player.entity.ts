import { createEntityId, Entity, type EntityId } from '../entity';
import type { Team } from './team.entity';
import { GAME_EVENTS, type Game } from '../game/game';
import { CardManagerComponent } from '../card/card-manager.component';
import type { Card, CardOptions } from '../card/card.entity';
import { GoldManagerComponent } from './components/gold-manager';
import { config } from '../config';
import { DECK_EVENTS } from '../card/deck.entity';
import type { Point3D, Values } from '@game/shared';
import { TypedEventEmitter } from '../utils/typed-emitter';
import { RuneManager } from './components/rune-manager';
import { match } from 'ts-pattern';
import { Rune, RUNES } from '../utils/rune';
import { Obstacle } from '../obstacle/obstacle.entity';
import type { QuestCard } from '../card/quest-card.entity';

export type PlayerOptions = {
  id: string;
  name: string;
  deck: CardOptions[];
  altarPosition: Point3D;
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

type ResourceAction =
  | { type: 'draw'; payload: Record<string, never> }
  | { type: 'gold'; payload: Record<string, never> }
  | { type: 'rune'; payload: { rune: string } };

export class Player extends Entity {
  private game: Game;

  readonly team: Team;

  readonly name: string;

  private readonly cardManager: CardManagerComponent;

  private readonly goldManager: GoldManagerComponent;

  private readonly runeManager: RuneManager;

  readonly altarPosition: Point3D;

  private emitter = new TypedEventEmitter<PlayerEventMap>();

  public mulliganIndices: number[] = [];

  public hasMulliganed = false;

  private resourceActionsTaken = 0;

  readonly altar: Obstacle;

  readonly quests = new Set<QuestCard>();

  constructor(game: Game, team: Team, options: PlayerOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.team = team;
    this.name = options.name;
    this.altarPosition = options.altarPosition;
    this.runeManager = new RuneManager();

    this.cardManager = new CardManagerComponent(this.game, this, {
      deck: options.deck
    });
    this.goldManager = new GoldManagerComponent(this.game, config.INITIAL_GOLD);
    this.forwardEvents();
    this.draw(config.INITIAL_HAND_SIZE);
    this.game.on(GAME_EVENTS.TURN_START, this.onGameTurnStart.bind(this));
    this.game.on(GAME_EVENTS.START_BATTLE, this.onBattleStart.bind(this));

    this.altar = new Obstacle(this.game, {
      blueprintId: 'altar',
      id: `Player_${this.id}_altar` as EntityId,
      position: options.altarPosition,
      playerId: this.id
    });
    this.game.boardSystem.getCellAt(options.altarPosition)!.obstacle = this.altar;
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

  get gold() {
    return this.goldManager.amount;
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
    match(action)
      .with({ type: 'draw' }, () => {
        this.draw(1);
      })
      .with({ type: 'gold' }, () => {
        this.goldManager.deposit(1);
      })
      .with({ type: 'rune' }, action => {
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

  onGameTurnStart() {
    this.resourceActionsTaken = 0;
    this.draw(config.CARDS_DRAWN_PER_TURN);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onBattleStart() {}

  endTurn() {
    console.log('end turn');
    this.emitter.emit(PLAYER_EVENTS.END_TURN, { id: this.id });
  }
}

import { createEntityId, Entity } from '../entity';
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
import { RUNES } from '../utils/rune';
import { CARD_KINDS } from '../card/card-enums';
import { GeneralCard } from '../card/general-card.entity';

export type PlayerOptions = {
  id: string;
  name: string;
  deck: CardOptions[];
  startPosition: Point3D;
};

export const PLAYER_EVENTS = {
  BEFORE_DRAW: 'before_draw',
  AFTER_DRAW: 'after_draw'
} as const;

export type PlayerEvent = Values<typeof PLAYER_EVENTS>;
export type PlayerEventMap = {
  [PLAYER_EVENTS.BEFORE_DRAW]: [{ amount: number }];
  [PLAYER_EVENTS.AFTER_DRAW]: [{ cards: Card[] }];
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

  readonly startPosition: Point3D;

  private emitter = new TypedEventEmitter<PlayerEventMap>();

  public mulliganIndices: number[] = [];

  public hasMulliganed = false;

  private resourceActionsTaken = 0;

  private generalCard: GeneralCard;

  constructor(game: Game, team: Team, options: PlayerOptions) {
    super(createEntityId(options.id));
    this.game = game;
    this.team = team;
    this.name = options.name;
    this.startPosition = options.startPosition;
    this.runeManager = new RuneManager();

    const [general] = options.deck.splice(
      options.deck.findIndex(card => card.blueprint.kind === CARD_KINDS.GENERAL),
      1
    );
    this.generalCard = new GeneralCard(this.game, this, general);

    this.cardManager = new CardManagerComponent(this.game, this, {
      deck: options.deck
    });
    this.goldManager = new GoldManagerComponent(this.game, config.INITIAL_GOLD);
    this.forwardEvents();
    this.draw(config.INITIAL_HAND_SIZE);
    this.game.on(GAME_EVENTS.TURN_START, this.onGameTurnStart.bind(this));
    this.game.on(GAME_EVENTS.START_BATTLE, this.onBattleStart.bind(this));
  }

  shutdown() {
    this.emitter.removeAllListeners();
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

  get addGold() {
    return this.goldManager.deposit.bind(this.goldManager);
  }

  get spendGold() {
    return this.goldManager.spend.bind(this.goldManager);
  }

  get runes() {
    return this.runeManager.runes;
  }

  get addRune() {
    return this.runeManager.add.bind(this.runeManager);
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

  get general() {
    return this.units.find(u => u.card.kind === CARD_KINDS.GENERAL)!;
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
    this.resourceActionsTaken++;
  }

  mulligan() {
    for (const index of this.mulliganIndices) {
      this.cardManager.replaceCardAt(index);
    }
  }

  canPlayCardAt(index: number) {
    const card = this.getCardAt(index);
    if (!card) return false;
    if (!this.game.turnSystem.activeUnit.canPlayCardFromHand) return false;

    return card.canPlay;
  }

  playCard(index: number, targets: Point3D[]) {
    const card = this.cardManager.getCardAt(index);
    if (!card) return;
    this.game.turnSystem.activeUnit.playCard(card, targets, this.cardManager);
  }

  onGameTurnStart() {
    this.resourceActionsTaken = 0;
    this.draw(config.CARDS_DRAWN_PER_TURN);
  }

  onBattleStart() {
    this.generalCard.play();
  }
}

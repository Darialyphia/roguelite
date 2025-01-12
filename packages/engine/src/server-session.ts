import {
  randomInt,
  type BetterOmit,
  type Nullable,
  type PartialBy,
  type Point3D
} from '@game/shared';
import { Game, type GameOptions } from './game/game';
import { ServerRngSystem } from './rng/server-rng.system';
import type { Input } from './input/input';
import type { SerializedInput } from './input/input-system';
import { InputSimulator } from './input/input-simulator';
import type { EntityId } from './entity';

export type ServerSessionOptions = BetterOmit<
  PartialBy<GameOptions, 'configOverrides'>,
  'rngCtor' | 'id'
> & {
  id?: string;
};

export type SimulationResult = {
  damageTaken: Record<EntityId, number>;
  healReceived: Record<EntityId, number>;
  deaths: EntityId[];
  newEntities: Array<{
    id: EntityId;
    position: Point3D;
    spriteId: string;
  }>;
};

export class ServerSession {
  readonly game: Game;

  constructor(options: ServerSessionOptions) {
    this.game = new Game({
      id: options.id ?? 'SERVER',
      rngSeed: options.rngSeed,
      rngCtor: ServerRngSystem,
      mapId: options.mapId,
      teams: options.teams,
      configOverrides: options.configOverrides ?? {}
    });
  }

  initialize() {
    return this.game.initialize();
  }

  subscribe(cb: (input: SerializedInput, opts: { rngValues: number[] }) => void) {
    let lastRngValueIndexSent = this.game.rngSystem.values.length;
    let latestInput: Nullable<Input<any>> = null;

    this.game.on('game.input-queue-flushed', () => {
      const lastInput = this.game.inputSystem.getHistory().at(-1)!;
      // update for  this input has already been pushed
      if (latestInput === lastInput) return;

      cb(lastInput.serialize() as SerializedInput, {
        rngValues: this.game.rngSystem.values.slice(lastRngValueIndexSent)
      });
      lastRngValueIndexSent = this.game.rngSystem.values.length;
      latestInput = lastInput;
    });
  }

  get dispatch() {
    return this.game.dispatch.bind(this.game);
  }

  runSimulation(input: SerializedInput) {
    const simulator = new InputSimulator(this.game, [input], randomInt(9999));
    simulator.prepare();
    const result: SimulationResult = {
      damageTaken: {},
      healReceived: {},
      deaths: [],
      newEntities: []
    };

    simulator.game.on('unit.after_receive_damage', event => {
      if (!result.damageTaken[event.unit.id]) {
        result.damageTaken[event.unit.id] = 0;
      }
      result.damageTaken[event.unit.id] += event.damage.getMitigatedAmount(event.unit);
    });
    simulator.game.on('unit.after_receive_heal', event => {
      if (!result.healReceived[event.unit.id]) {
        result.healReceived[event.unit.id] = 0;
      } else {
        result.healReceived[event.unit.id] += event.amount;
      }
    });
    simulator.game.on('unit.after_destroy', event => {
      result.deaths.push(event.unit.id);
    });
    simulator.game.on('unit.created', event => {
      result.newEntities.push({
        id: event.id,
        spriteId: event.unit.spriteId,
        position: event.unit.position.serialize()
      });
    });

    simulator.run({
      onBeforeInput() {
        return;
      },
      onAfterInput() {
        return;
      }
    });
    simulator.shutdown();

    return result;
  }
}

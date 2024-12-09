import type { Point, Values } from '@game/shared';
import type { EntityId } from '../entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

type LightBlendMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type SpriteBlendMode = 0 | 1 | 2 | 3;

const VFX_TYPES = {
  SHAKE_UNIT: 'SHAKE_UNIT',
  SHAKE_SCREEN: 'SHAKE_SCREEN',
  ADD_SPRITE_ON_UNIT: 'SHAKE_UNIT',
  ADD_SPRITE_ON_SCREEN_CENTER: 'SHAKE_UNIT',
  TINT_UNIT: 'TINT_UNIT',
  TINT_SCREEN: 'TINT_SCREEN',
  ADD_LIGHT_ON_UNIT: 'ADD_LIGHT_ON_UNIT',
  BLOOM_SCREEN: 'BLOOM_SCREEN',
  BLOOM_UNIT: 'BLOOM_SCREEN',
  SHOCKWAVE: 'SHOCKWAVE',
  WAIT: 'WAIT'
} as const;

export type VFXType = Values<typeof VFX_TYPES>;

export type VFXConfig =
  | {
      type: typeof VFX_TYPES.SHAKE_UNIT;
      params: {
        unit: EntityId;
        isBidirectional: boolean;
        amplitude: number;
        duration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.SHAKE_SCREEN;
      params: {
        isBidirectional: boolean;
        amplitude: number;
        duration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.ADD_SPRITE_ON_UNIT;
      params: {
        unit: EntityId;
        spritesheetName: string;
        animationName: string;
        offset: Point;
        duration: number;
        blendMode: SpriteBlendMode;
      };
    }
  | {
      type: typeof VFX_TYPES.ADD_SPRITE_ON_SCREEN_CENTER;
      params: {
        spritesheetName: string;
        animationName: string;
        offset: Point;
        duration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.TINT_UNIT;
      params: {
        unit: EntityId;
        color: string;
        alpha: number;
        duration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.TINT_SCREEN;
      params: {
        color: string;
        alpha: number;
        duration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.ADD_LIGHT_ON_UNIT;
      params: {
        unit: EntityId;
        colorStops: Array<[number, string]>;
        offset: Point;
        alpha: number;
        radius: number;
        duration: number;
        blendMode: LightBlendMode;
      };
    }
  | {
      type: typeof VFX_TYPES.BLOOM_SCREEN;
      params: {
        strength: number;
        duration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.BLOOM_UNIT;
      params: {
        units: EntityId[];
        strength: number;
        duration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.SHOCKWAVE;
      params: {
        unit: EntityId;
        radius: number;
        duration: number;
        wavelength: number;
      };
    }
  | {
      type: typeof VFX_TYPES.WAIT;
      params: {
        duration: number;
      };
    };

export type VFXSequenceTrack = {
  steps: VFXConfig[][];
};
export type VFXSequence = {
  tracks: VFXSequenceTrack[];
};

type FxEventMap = {
  [Key in VFXType]: [VFXConfig & { type: Key }];
};

export class VFXPlayer {
  private emitter = new TypedEventEmitter<FxEventMap>(true);

  async playSequence(sequence: VFXSequence) {
    await Promise.all(sequence.tracks.map(track => this.playTrack(track)));
  }

  private async playTrack(track: VFXSequenceTrack) {
    for (const step of track.steps) {
      await Promise.all(
        step.map(config => this.emitter.emitAsync(config.type, config as any))
      );
    }
  }
}

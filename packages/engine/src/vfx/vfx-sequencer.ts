import type { Point, Point3D, Values } from '@game/shared';
import type { EntityId } from '../entity';
import { TypedEventEmitter } from '../utils/typed-emitter';

type LightBlendMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type SpriteBlendMode = 0 | 1 | 2 | 3;

const VFX_TYPES = {
  SHAKE_UNIT: 'SHAKE_UNIT',
  SHAKE_SCREEN: 'SHAKE_SCREEN',
  ADD_SPRITE_AT: 'ADD_SPRITE_AT',
  ADD_SPRITE_ON_SCREEN_CENTER: 'ADD_SPRITE_ON_SCREEN_CENTER',
  TINT_UNIT: 'TINT_UNIT',
  TINT_SCREEN: 'TINT_SCREEN',
  ADD_LIGHT_AT: 'ADD_LIGHT_ON_UNIT',
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
      type: typeof VFX_TYPES.ADD_SPRITE_AT;
      params: {
        position: Point3D;
        spritesheetName: string;
        animationName: string;
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
      type: typeof VFX_TYPES.ADD_SPRITE_AT;
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
        transitionDuration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.TINT_SCREEN;
      params: {
        blendMode: LightBlendMode;
        steps: Array<{
          color: string;
          transitionDuration: number;
          duration: number;
        }>;
        endTransitionDuration: number;
      };
    }
  | {
      type: typeof VFX_TYPES.ADD_LIGHT_AT;
      params: {
        position: Point3D;
        blendMode: LightBlendMode;
        fadeInDuration: number;
        fadeOutDuration: number;
        steps: Array<{
          colorStops: Array<[number, string]>;
          radius: number;
          offset: Point;
          duration: number;
        }>;
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
  steps: VFXConfig[];
};
export type VFXSequence = {
  tracks: VFXSequenceTrack[];
};

export type VFXEventMap = {
  [Key in VFXType]: [(VFXConfig & { type: Key })['params']];
};

export class VFXPlayer {
  private emitter = new TypedEventEmitter<VFXEventMap>(true);

  get on() {
    return this.emitter.on.bind(this.emitter);
  }

  get off() {
    return this.emitter.off.bind(this.emitter);
  }

  async playSequence(sequence: VFXSequence) {
    await Promise.all(sequence.tracks.map(track => this.playTrack(track)));
  }

  private async playTrack(track: VFXSequenceTrack) {
    for (const step of track.steps) {
      await this.emitter.emitAsync(step.type, step.params as any);
    }
  }
}

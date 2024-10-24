import type { ParsedAsepriteSheet } from '@/utils/aseprite-parser';
import { isString } from '@game/shared';
import { AnimatedSprite, Container, ObservablePoint, Point } from 'pixi.js';

export type Parts = {
  armor: string;
  helm: string;
  weapon: string;
  vfx: string;
};

export class MultiLayerAnimatedSprite extends Container {
  body: AnimatedSprite;

  armor: AnimatedSprite;

  helm: AnimatedSprite;

  weapon: AnimatedSprite;

  vfx: AnimatedSprite;

  readonly anchor = new ObservablePoint(
    {
      _onUpdate: point => {
        this.body.anchor.set(point?.x, point?.y);
        this.armor.anchor.set(point?.x, point?.y);
        this.helm.anchor.set(point?.x, point?.y);
        this.weapon.anchor.set(point?.x, point?.y);
        this.vfx.anchor.set(point?.x, point?.y);
      }
    },
    0,
    0
  );

  private parts: Parts;

  constructor(
    private sheets: ParsedAsepriteSheet['sheets'],
    private _animation: string,
    parts: string | Parts
  ) {
    super();
    this.parts = isString(parts)
      ? { armor: parts, helm: parts, weapon: parts, vfx: parts }
      : {
          armor: parts.armor,
          helm: parts.helm,
          weapon: parts.weapon,
          vfx: parts.vfx
        };
    this.body = new AnimatedSprite(this.getBodyFrames());
    this.armor = new AnimatedSprite(this.getFrames('armor'));
    this.helm = new AnimatedSprite(this.getFrames('helm'));
    this.weapon = new AnimatedSprite(this.getFrames('weapon'));
    this.vfx = new AnimatedSprite(this.getFrames('vfx'));
    this.addChild(this.body, this.armor, this.helm, this.weapon, this.vfx);
  }

  get animation() {
    return this._animation;
  }

  set animation(val) {
    this._animation = val;
    this.updateParts();
  }

  private updateParts() {
    this.armor.textures = this.getFrames('armor');
    this.helm.textures = this.getFrames('helm');
    this.weapon.textures = this.getFrames('weapon');
    this.vfx.textures = this.getFrames('vfx');
  }

  private getBodyFrames() {
    return this.sheets.base.body.animations[this._animation];
  }

  private getFrames(
    part: Exclude<keyof ParsedAsepriteSheet['sheets'][string], 'body'>
  ) {
    return this.sheets[this.parts[part]][part].animations[this._animation];
  }

  setPart(part: keyof Parts, value: string) {
    this.parts[part] = value;
    this.updateParts();
  }
}

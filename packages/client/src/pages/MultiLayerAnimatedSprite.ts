import type { ParsedAsepriteSheet } from '@/utils/aseprite-parser';
import { isDefined, isString } from '@game/shared';
import { AnimatedSprite, Container, ObservablePoint, Texture } from 'pixi.js';
import { ref, watchEffect, type Ref } from 'vue';

export type Parts = {
  armor: string | null;
  helm: string | null;
  weapon: string | null;
  vfx: string | null;
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

  private _sheets: ParsedAsepriteSheet['sheets'];

  private _parts: Ref<Parts>;

  private _animation: Ref<string>;

  constructor(
    sheets: ParsedAsepriteSheet['sheets'],
    animation: string,
    parts: null | string | Parts
  ) {
    super();
    this._sheets = sheets;
    this._animation = ref(animation);
    this._parts = ref(
      isString(parts) || !isDefined(parts)
        ? { armor: parts, helm: parts, weapon: parts, vfx: parts }
        : {
            armor: parts.armor,
            helm: parts.helm,
            weapon: parts.weapon,
            vfx: parts.vfx
          }
    );
    this.body = new AnimatedSprite(this.getBodyFrames());
    this.armor = new AnimatedSprite(this.getFrames('armor'));
    this.helm = new AnimatedSprite(this.getFrames('helm'));
    this.weapon = new AnimatedSprite(this.getFrames('weapon'));
    this.vfx = new AnimatedSprite(this.getFrames('vfx'));
    this.addChild(this.body, this.armor, this.helm, this.weapon, this.vfx);

    const unsub = watchEffect(() => {
      this.updateParts();
    });
    this.on('destroyed', unsub);
  }

  get parts() {
    return this._parts.value;
  }

  get animation() {
    return this._animation.value;
  }

  set animation(val) {
    this._animation.value = val;
  }

  get sheets() {
    return this._sheets;
  }

  set sheets(val) {
    this._sheets = val;
    this.updateParts();
  }

  private updateParts() {
    this.body.textures = this.getBodyFrames();
    this.armor.textures = this.getFrames('armor');
    this.helm.textures = this.getFrames('helm');
    this.weapon.textures = this.getFrames('weapon');
    this.vfx.textures = this.getFrames('vfx');
  }

  private getBodyFrames() {
    return this._sheets.base.body.animations[this._animation.value];
  }

  private getFrames(
    part: Exclude<keyof ParsedAsepriteSheet['sheets'][string], 'body'>
  ) {
    if (!this._parts.value[part]) return [Texture.EMPTY];

    return this._sheets[this._parts.value[part]][part].animations[
      this._animation.value
    ];
  }
}

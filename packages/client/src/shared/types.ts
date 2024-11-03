import type { Application, Container, Ticker } from 'pixi.js';

export interface Scene extends Container {
  update?: (time: Ticker) => void;
  mount?: (app: Application) => Promise<void>;
  unmount?: (app: Application) => Promise<void>;
}

export interface SceneConstructor {
  readonly SCENE_ID: string;
  new (): Scene;
}

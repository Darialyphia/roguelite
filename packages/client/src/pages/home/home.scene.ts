import type { Scene } from '@/shared/types';
import { Application, Container, Graphics } from 'pixi.js';

export class HomeScene extends Container implements Scene {
  static SCENE_ID = 'home';

  async mount(app: Application) {
    const g = new Graphics()
      .rect(app.screen.width / 2 - 50, app.screen.height / 2 - 50, 100, 100)
      .fill(0xff0000);

    this.addChild(g);
  }
}

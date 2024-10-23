<script setup lang="ts">
import {
  ASEPRITE_SPRITESHEET_PARSER,
  asepriteSpriteSheetParser,
  type ParsedAsepriteSheet
} from '@/utils/aseprite-parser';
import { AnimatedSprite, Application, Assets, extensions } from 'pixi.js';
import { onMounted, useTemplateRef } from 'vue';

const canvas = useTemplateRef('pixiRoot');

onMounted(async () => {
  const app = new Application();
  await app.init({
    background: '#222233',
    resizeTo: window,
    antialias: false,
    canvas: canvas.value!
  });

  extensions.add(asepriteSpriteSheetParser);

  Assets.addBundle('swordsman', [
    {
      alias: 'swordsmanSheets',
      src: '/resources/sprites/swordsman.json',
      loadParser: ASEPRITE_SPRITESHEET_PARSER
    }
  ]);

  const { swordsmanSheets } = (await Assets.loadBundle('swordsman')) as {
    swordsmanSheets: ParsedAsepriteSheet;
  };

  const sprites = [
    new AnimatedSprite(swordsmanSheets.base.body.animations.idle),
    new AnimatedSprite(swordsmanSheets.tier3.armor.animations.idle),
    new AnimatedSprite(swordsmanSheets.tier3.helm.animations.idle),
    new AnimatedSprite(swordsmanSheets.tier3.weapon.animations.idle),
    new AnimatedSprite(swordsmanSheets.tier3.vfx.animations.idle)
  ];
  sprites.forEach(sprite => {
    app.stage.addChild(sprite);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(app.screen.width / 2, app.screen.height / 2);
    sprite.scale.set(4);
  });
});
</script>

<template>
  <canvas ref="pixiRoot" />
</template>

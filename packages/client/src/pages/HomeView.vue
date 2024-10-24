<script setup lang="ts">
import {
  ASEPRITE_SPRITESHEET_PARSER,
  asepriteSpriteSheetParser,
  type ParsedAsepriteSheet
} from '@/utils/aseprite-parser';
import { AnimatedSprite, Application, Assets, extensions } from 'pixi.js';
import { onMounted, ref, shallowRef, useTemplateRef, watchEffect } from 'vue';

const canvas = useTemplateRef('pixiRoot');

const helm = ref('tier1');
const weapon = ref('tier1');
const armor = ref('tier1');
const vfx = ref('tier1');
const app = shallowRef(new Application());

const sprites = shallowRef<{
  body?: AnimatedSprite;
  weapon?: AnimatedSprite;
  armor?: AnimatedSprite;
  helm?: AnimatedSprite;
  vfx?: AnimatedSprite;
}>({});

let sheets: ParsedAsepriteSheet;
const updateTextures = () => {
  if (!sprites.value.armor) {
    return;
  }

  sprites.value.armor!.textures = sheets[armor.value].armor.animations.idle;
  sprites.value.helm!.textures = sheets[helm.value].helm.animations.idle;
  sprites.value.weapon!.textures = sheets[weapon.value].weapon.animations.idle;
  sprites.value.vfx!.textures = sheets[vfx.value].vfx.animations.idle;
};
watchEffect(updateTextures);

onMounted(async () => {
  await app.value.init({
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
  sheets = swordsmanSheets;
  sprites.value = {
    body: new AnimatedSprite(sheets.base.body.animations.idle),
    armor: new AnimatedSprite(sheets[armor.value].armor.animations.idle),
    helm: new AnimatedSprite(sheets[helm.value].helm.animations.idle),
    weapon: new AnimatedSprite(sheets[weapon.value].weapon.animations.idle),
    vfx: new AnimatedSprite(sheets[vfx.value].vfx.animations.idle)
  };

  [
    sprites.value.body!,
    sprites.value.armor!,
    sprites.value.helm!,
    sprites.value.weapon!,
    sprites.value.vfx!
  ].forEach(sprite => {
    app.value.stage.addChild(sprite);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(
      app.value.screen.width / 2,
      app.value.screen.height / 2
    );
    sprite.scale.set(4);
  });
});
</script>

<template>
  <div class="grid">
    <canvas ref="pixiRoot" />
    <div class="ui">
      <fieldset>
        <legend>Armor</legend>
        <label>
          <input type="radio" v-model="armor" value="tier1" />
          Tier 1
        </label>
        <label>
          <input type="radio" v-model="armor" value="tier2" />
          Tier 2
        </label>
        <label>
          <input type="radio" v-model="armor" value="tier3" />
          Tier 3
        </label>
        <label>
          <input type="radio" v-model="armor" value="tier4" />
          Tier 4
        </label>
      </fieldset>

      <fieldset>
        <legend>Helm</legend>
        <label>
          <input type="radio" v-model="helm" value="tier1" />
          Tier 1
        </label>
        <label>
          <input type="radio" v-model="helm" value="tier2" />
          Tier 2
        </label>
        <label>
          <input type="radio" v-model="helm" value="tier3" />
          Tier 3
        </label>
        <label>
          <input type="radio" v-model="helm" value="tier4" />
          Tier 4
        </label>
      </fieldset>

      <fieldset>
        <legend>Weapon</legend>
        <label>
          <input type="radio" v-model="weapon" value="tier1" />
          Tier 1
        </label>
        <label>
          <input type="radio" v-model="weapon" value="tier2" />
          Tier 2
        </label>
        <label>
          <input type="radio" v-model="weapon" value="tier3" />
          Tier 3
        </label>
        <label>
          <input type="radio" v-model="weapon" value="tier4" />
          Tier 4
        </label>
      </fieldset>

      <fieldset>
        <legend>VFX</legend>
        <label>
          <input type="radio" v-model="vfx" value="tier1" />
          Tier 1
        </label>
        <label>
          <input type="radio" v-model="vfx" value="tier2" />
          Tier 2
        </label>
        <label>
          <input type="radio" v-model="vfx" value="tier3" />
          Tier 3
        </label>
        <label>
          <input type="radio" v-model="vfx" value="tier4" />
          Tier 4
        </label>
      </fieldset>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.grid {
  display: grid;
  > * {
    grid-column: 1;
    grid-row: 1;
  }
}

.ui {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  fieldset {
    pointer-events: auto;
  }
}
</style>

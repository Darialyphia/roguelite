<script setup lang="ts">
import { MultiLayerAnimatedSprite } from '@/components/MultiLayerAnimatedSprite';
import {
  ASEPRITE_SPRITESHEET_PARSER,
  asepriteSpriteSheetParser,
  type ParsedAsepriteSheet
} from '@/utils/aseprite-parser';
import { AnimatedSprite, Application, Assets, extensions } from 'pixi.js';
import { onMounted, ref, shallowRef, useTemplateRef, watchEffect } from 'vue';

const canvas = useTemplateRef('pixiRoot');

const app = shallowRef(new Application());

const spriteGroups = ref<string[]>([]);
const sprite = shallowRef<MultiLayerAnimatedSprite>();

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

  const sheets = swordsmanSheets.sheets;
  spriteGroups.value = swordsmanSheets.groups;

  sprite.value = new MultiLayerAnimatedSprite(sheets, 'idle', 'tier1');

  app.value.stage.addChild(sprite.value);
  sprite.value.anchor.set(0.5, 0.5);
  sprite.value.position.set(
    app.value.screen.width / 2,
    app.value.screen.height / 2
  );
  sprite.value.scale.set(4);
});
const parts = ['armor', 'helm', 'weapon', 'vfx'] as const;
</script>

<template>
  <div class="grid">
    <canvas ref="pixiRoot" />
    <div class="ui">
      <fieldset v-for="part in parts" :key="part">
        <legend>{{ part }}</legend>
        <label v-for="group in spriteGroups" :key="group">
          <input
            type="radio"
            :name="part"
            :value="group"
            @change="
              e => {
                const val = (e.target as HTMLInputElement).value;
                console.log(val);
                sprite?.setPart(part, val);
              }
            "
          />
          {{ group }}
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

  legend,
  label {
    text-transform: capitalize;
  }
}
</style>

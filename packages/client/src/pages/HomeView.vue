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

  sprite.value = new MultiLayerAnimatedSprite(sheets, 'idle', null);

  app.value.stage.addChild(sprite.value);
  sprite.value.anchor.set(0.5, 0.5);
  sprite.value.position.set(
    app.value.screen.width / 2,
    app.value.screen.height / 2
  );
  sprite.value.scale.set(3);
});
const parts = ['armor', 'helm', 'weapon', 'vfx'] as const;
</script>

<template>
  <div class="grid">
    <canvas ref="pixiRoot" />
    <div class="ui" v-if="sprite">
      <div class="pixel-corners--wrapper" v-for="part in parts" :key="part">
        <div class="pixel-corners controls">
          <h3>{{ part }}</h3>
          <label
            v-for="group in spriteGroups"
            :key="group"
            class="pixel-corners"
          >
            <input
              type="radio"
              :name="part"
              :value="group"
              :checked="sprite.parts[part] === group"
              @change="sprite.parts[part] = group"
            />
            {{ group }}
          </label>
          <label class="pixel-corners">
            <input
              type="radio"
              :name="part"
              :value="null"
              :checked="sprite.parts[part] === null"
              @change="sprite.parts[part] = null"
            />
            none
          </label>
        </div>
      </div>
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
  padding: 3rem;

  .controls {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 1.25rem;
    border: none;
    padding: 1.5rem;
  }

  h3,
  label {
    text-transform: capitalize;
  }

  h3 {
    font-weight: 700;
    font-size: 1.75rem;
  }

  label {
    background: #eee;
    color: #223;
    padding: 0.5rem;
    cursor: pointer;
    &:hover {
      background-color: hsl(165 70% 80%);
    }
    &:has(input:checked) {
      background-color: hsl(165 70% 50%);
    }
    > input {
      border: 0 !important;
      clip-path: inset(50%) !important;
      height: 1px !important;
      margin: -1px !important;
      overflow: hidden !important;
      padding: 0 !important;
      position: absolute !important;
      width: 1px !important;
      white-space: nowrap !important;
    }
  }
}
</style>

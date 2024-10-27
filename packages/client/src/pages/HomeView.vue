<script setup lang="ts">
import { MultiLayerAnimatedSprite } from '@/components/MultiLayerAnimatedSprite';
import {
  ASEPRITE_SPRITESHEET_PARSER,
  asepriteSpriteSheetParser,
  type ParsedAsepriteSheet
} from '@/utils/aseprite-parser';
import { Application, Assets, extensions } from 'pixi.js';
import {
  computed,
  onMounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch
} from 'vue';

const canvas = useTemplateRef('pixiRoot');

const app = shallowRef(new Application());

const sprite = shallowRef<MultiLayerAnimatedSprite>();

const characters = shallowRef<
  Array<{ name: string; sheets: ParsedAsepriteSheet }>
>([]);
const selectedCharacterIndex = ref(1);
const selectedCharacter = computed(
  () => characters.value[selectedCharacterIndex.value]
);
watch(selectedCharacter, character => {
  sprite.value!.sheets = character.sheets.sheets;
});
const spriteGroups = computed(() => selectedCharacter.value?.sheets.groups);

onMounted(async () => {
  await app.value.init({
    background: '#222233',
    resizeTo: window,
    antialias: false,
    canvas: canvas.value!
  });

  extensions.add(asepriteSpriteSheetParser);

  Assets.add({
    alias: 'swordsman',
    src: '/resources/sprites/swordsman.json',
    loadParser: ASEPRITE_SPRITESHEET_PARSER
  });
  Assets.add({
    alias: 'wizard',
    src: '/resources/sprites/wizard.json',
    loadParser: ASEPRITE_SPRITESHEET_PARSER
  });

  characters.value = [
    {
      name: 'Warrior',
      sheets: await Assets.load<ParsedAsepriteSheet>('swordsman')
    },
    { name: 'Mage', sheets: await Assets.load<ParsedAsepriteSheet>('wizard') }
  ];

  sprite.value = new MultiLayerAnimatedSprite(
    selectedCharacter.value.sheets.sheets,
    'idle',
    null
  );

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
    <div class="ui" v-if="sprite && spriteGroups">
      <section>
        <div class="pixel-corners--wrapper">
          <div class="pixel-corners controls">
            <h3>Select your class</h3>

            <label
              v-for="(character, index) in characters"
              :key="character.name"
              class="pixel-corners"
            >
              <input
                type="radio"
                name="character"
                :value="index"
                v-model="selectedCharacterIndex"
              />
              {{ character.name }}
            </label>
          </div>
        </div>
      </section>

      <section class="cosmetics">
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
      </section>
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

section {
  padding: 3rem;
}

.ui {
  pointer-events: none;
}
.cosmetics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.controls {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 1.25rem;
  border: none;
  padding: 1.5rem;

  &:focus-within {
    :has(&)::after {
      background-color: hsl(165 70% 40%);
    }
  }
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
</style>

<script setup lang="ts">
import type { CardViewModel } from '../card.model';
import { config } from '@/utils/config';
import StatCircle from './StatCircle.vue';
import { CARD_KINDS, UNIT_TYPES } from '@game/engine/src/card/card-enums';
import { match } from 'ts-pattern';
import { RUNES, type Rune } from '@game/engine/src/utils/rune';
import { useDynamicFontSize } from '@/shared/composables/useDynamicFontSize';
import TextWithKeywords from './TextWithKeywords.vue';
import { useElementHover, useMouse } from '@vueuse/core';
import { clamp } from '@game/shared';

const { card, violations } = defineProps<{
  card: Pick<
    CardViewModel,
    'name' | 'description' | 'kind' | 'iconId' | 'cost'
  > &
    Partial<
      Pick<CardViewModel & { kind: 'unit' }, 'atk' | 'maxHp' | 'unitType'>
    >;
  violations?: { job?: boolean; ap?: boolean; gold?: boolean; runes?: boolean };
}>();

const nameFontSize = useDynamicFontSize(card.name, {
  minFontSize: 10,
  maxFontSize: 21,
  maxLineLength: 30
});

const imagePath = computed(() => `url(/assets/icons/${card.iconId}.png)`);

const metaString = computed(() =>
  match(card)
    .with({ kind: CARD_KINDS.SPELL }, { kind: CARD_KINDS.QUEST }, card => {
      return card.kind;
    })
    .with({ kind: CARD_KINDS.UNIT }, card => [card.unitType].join(' - '))
    .exhaustive()
);
const metaFontSize = useDynamicFontSize(metaString, {
  minFontSize: 10,
  maxFontSize: 21,
  maxLineLength: 22
});

const getCostByRune = (rune: Rune) => {
  return card.cost.runes.filter(r => r.equals(rune)).length;
};

const runeCosts = computed(() => {
  return [
    { rune: RUNES.YELLOW, count: getCostByRune(RUNES.YELLOW) },
    { rune: RUNES.PURPLE, count: getCostByRune(RUNES.PURPLE) },
    { rune: RUNES.GREEN, count: getCostByRune(RUNES.GREEN) },
    { rune: RUNES.RED, count: getCostByRune(RUNES.RED) },
    { rune: RUNES.BLUE, count: getCostByRune(RUNES.BLUE) },
    { rune: RUNES.COLORLESS, count: getCostByRune(RUNES.COLORLESS) }
  ];
});

const root = useTemplateRef('card');
const { x, y } = useMouse();

const pointerStyle = computed(() => {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  return {
    x: clamp(x.value - rect.left, 0, rect.width),
    y: clamp(y.value - rect.top, 0, rect.height)
  };
});
</script>

<template>
  <div class="card" ref="card">
    <header class="grid grid-cols-2">
      <div class="cost">
        <StatCircle
          v-if="
            card.kind === CARD_KINDS.UNIT
              ? card.unitType === UNIT_TYPES.MINION
              : true
          "
          :value="card.cost.gold"
          icon="gold"
          :invalid="violations?.gold"
        />

        <ul>
          <li
            v-for="rune in runeCosts"
            :key="rune.rune.id"
            v-show="rune.count > 0"
            class="rune"
            :style="{
              '--bg': `url('/assets/ui/rune-${rune.rune.id.toLowerCase()}-small.png')`
            }"
          >
            {{ rune.count }}
          </li>
        </ul>
      </div>
    </header>
    <div class="name">{{ card.name }}</div>
    <div class="description">
      <TextWithKeywords :text="card.description" />
    </div>
    <div class="meta">
      {{ metaString }}
    </div>

    <div class="attack" v-if="card.kind === CARD_KINDS.UNIT">
      <StatCircle :value="card.atk!" icon="atk" />
    </div>
    <div class="hp" v-if="card.kind === CARD_KINDS.UNIT">
      <StatCircle :value="card.maxHp!" icon="hp" />
    </div>

    <div class="shine" />
    <div class="glare" />
  </div>
</template>

<style scoped lang="postcss">
.card {
  --width: calc(1px * v-bind('config.CARD_WIDTH'));
  --height: calc(1px * v-bind('config.CARD_HEIGHT'));
  --pointer-x: calc(1px * v-bind('pointerStyle?.x'));
  --pointer-y: calc(1px * v-bind('pointerStyle?.y'));

  width: var(--width);
  height: var(--height);
  background: url('/assets/ui/card-front.png'), v-bind(imagePath),
    url('/assets/ui/card-image-background.png');
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position:
    top left,
    center 30px,
    center 27px;
  color: #32021b;
  font-family: 'Silkscreen';
  user-select: none;
  position: relative;
  display: grid;
  grid-template-rows: 258px 21px calc(
      1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_HEIGHT')
    );
}

.name {
  font-size: v-bind(nameFontSize);
  color: #5d1529;
  display: grid;
  place-content: center;
  justify-self: center;
  max-width: calc(1px * v-bind('config.CARD_NAME_TEXTBOX_WIDTH'));
  line-height: 1;
  font-weight: var(--font-weight-7);
  font-family: var(--font-system-ui);
  text-transform: uppercase;
}

.description {
  width: calc(1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_WIDTH'));
  color: #5d1529;
  padding: calc(1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_PADDING'));
  justify-self: center;
  margin-top: 27px;
  font-size: 15px;
  /* text-align: center; */
  line-height: 1.1;
  font-weight: var(--font-weight-5);
  white-space: pre-line;
  font-family: var(--font-system-ui);
  text-wrap: pretty;
}

.hp {
  position: absolute;
  right: 0;
  bottom: 0;
}

.attack {
  position: absolute;
  right: left;
  bottom: 0;
}

.meta {
  font-family: 'Silkscreen';
  font-size: v-bind(metaFontSize);
  color: #d7ad42;
  text-transform: uppercase;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 36px;
  width: 156px;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  &.invalid {
    color: red;
  }
}

ul:has(.rune) {
  padding-left: 9px;
}

.rune {
  width: 42px;
  aspect-ratio: 1;
  background: var(--bg);
  display: grid;
  place-content: center;
  color: black;
  text-align: center;
  font-size: var(--font-size-4);
  text-shadow: 0 3px #d7ad42;
  text-align: center;
  font-family: var(--font-system-ui);
  font-weight: var(--font-weight-9);
  padding-bottom: 8px;
}

.glare {
  position: absolute;
  pointer-events: none;
  inset: 0;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.3s;
  background-image: radial-gradient(
    circle at var(--pointer-x) var(--pointer-y),
    hsla(0, 0%, 100%, 0.8) 10%,
    hsla(0, 0%, 100%, 0.65) 20%,
    hsla(0, 0%, 0%, 0.5) 90%
  );

  /* opacity: var(--card-opacity); */
  mix-blend-mode: overlay;

  .card:hover & {
    opacity: 0.8;
  }
}
</style>

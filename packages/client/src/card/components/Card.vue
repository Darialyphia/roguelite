<script setup lang="ts">
import type { CardViewModel } from '../card.model';
import { config } from '@/utils/config';
import StatCircle from './StatCircle.vue';
import { CARD_KINDS } from '@game/engine/src/card/card-enums';
import { match } from 'ts-pattern';
import { RUNES, type Rune } from '@game/engine/src/utils/rune';

const { card } = defineProps<{ card: CardViewModel }>();

const nameFontSize = computed(() => {
  const minFontSize = 10;
  const maxFontSize = 21;
  const maxLineLength = 30;
  const minViewportWidth = 1;
  const maxViewportWidth = 1900;
  const textLength = card.name.length;

  const relativeMaxFontSize =
    textLength > maxLineLength
      ? minFontSize
      : maxFontSize -
        ((maxFontSize - minFontSize) * textLength) / maxLineLength;

  const relativeMaxViewportWidth =
    maxViewportWidth * (minFontSize / relativeMaxFontSize);

  const relativeMinViewportWidth =
    minViewportWidth * (maxFontSize / relativeMaxFontSize);

  const viewportWidth =
    (100 * (maxFontSize - minFontSize)) /
    (relativeMaxViewportWidth - relativeMinViewportWidth);

  const relativeFontSize =
    (relativeMinViewportWidth * maxFontSize -
      relativeMaxViewportWidth * minFontSize) /
    (relativeMinViewportWidth - relativeMaxViewportWidth);

  return `clamp(${minFontSize / 16}rem, ${viewportWidth}vw + ${
    relativeFontSize / 16
  }rem, ${relativeMaxFontSize / 16}rem)`;
});

const imagePath = computed(() => `url(/assets/icons/${card.iconId}.png)`);

const metaString = computed(() =>
  match(card)
    .with({ kind: CARD_KINDS.SPELL }, card => card.kind)
    .with({ kind: CARD_KINDS.GENERAL }, card =>
      [card.kind, ...card.jobs.map(j => j.name)].join(' - ')
    )
    .with({ kind: CARD_KINDS.UNIT }, card =>
      [card.kind, ...card.jobs.map(j => j.name)].join(' - ')
    )
    .exhaustive()
);
const getCostByRune = (rune: Rune) => {
  if (card.kind === CARD_KINDS.GENERAL) return 0;
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
</script>

<template>
  <div class="card">
    <header class="grid grid-cols-2">
      <div class="cost">
        <StatCircle
          v-if="card.kind === CARD_KINDS.UNIT"
          :value="card.cost.gold"
          icon="gold"
        />
        <StatCircle
          v-if="card.kind === CARD_KINDS.SPELL"
          :value="card.cost.ap"
          icon="ap"
        />

        <ul
          v-if="card.kind === CARD_KINDS.UNIT || card.kind === CARD_KINDS.SPELL"
        >
          <li
            v-for="(rune, index) in runeCosts"
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
      <div
        class="stats"
        v-if="card.kind === CARD_KINDS.UNIT || card.kind === CARD_KINDS.GENERAL"
      >
        <StatCircle :value="card.maxHp" icon="hp" />
        <StatCircle :value="card.atk" icon="atk" />
        <StatCircle :value="card.speed" icon="speed" />
      </div>
    </header>
    <div class="name">{{ card.name }}</div>
    <div class="description">{{ card.description }}</div>
    <div class="meta">
      {{ metaString }}
    </div>

    <div
      class="reward"
      v-if="card.kind === CARD_KINDS.UNIT || card.kind === CARD_KINDS.GENERAL"
    >
      <StatCircle :value="card.reward" icon="vp" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.card {
  width: calc(1px * v-bind('config.CARD_WIDTH'));
  height: calc(1px * v-bind('config.CARD_HEIGHT'));
  background: url('/assets/ui/card-front.png'), v-bind(imagePath),
    url('/assets/ui/card-image-background.png');
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position:
    top left,
    center 30px,
    center 27px;
  color: #311929;
  font-family: 'Silkscreen';
  user-select: none;
  position: relative;
  display: grid;
  grid-template-rows: 258px 21px calc(
      1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_HEIGHT')
    );
}

.name {
  font-weight: bold;
  font-size: v-bind(nameFontSize);
  color: #5d1529;
  display: grid;
  place-content: center;
  justify-self: center;
  max-width: calc(1px * v-bind('config.CARD_NAME_TEXTBOX_WIDTH'));
  line-height: 1;
}

.description {
  font-family: 'Press Start 2P', system-ui;
  width: calc(1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_WIDTH'));
  color: #5d1529;
  padding: calc(1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_PADDING'));
  justify-self: center;
  margin-top: 27px;
  line-height: 1.2;
  font-size: 10px;
}

.stats {
  justify-self: end;
  display: grid;
  gap: 6px;
}

.reward {
  position: absolute;
  right: 0;
  bottom: 0;
}

.meta {
  font-family: 'Silkscreen';
  font-size: 14px;
  color: #d7ad42;
  text-transform: uppercase;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 36px;
  width: 156px;
  line-height: 1;
  text-align: center;
}

.rune {
  width: 30px;
  aspect-ratio: 1;
  background: var(--bg);
  display: grid;
  place-content: center;
  font-family: 'SilkScreen';
  color: black;
  text-align: center;
  font-size: var(--font-size-4);
  text-shadow: 0 3px #d7ad42;
  padding-left: 9px;
}
</style>

<script setup lang="ts">
import type { CardViewModel } from './card.model';
import { config } from '@/utils/config';

const { card } = defineProps<{ card: CardViewModel }>();

const nameFontSize = computed(() => {
  const minFontSize = 4;
  const maxFontSize = 14;
  const minLineLength = 0;
  const maxLineLength = 40;
  const minViewportWidth = 1;
  const maxViewportWidth = 1900;
  const textLength = card.name.length;

  const relativeMaxFontSize =
    textLength < minLineLength
      ? maxFontSize
      : textLength > maxLineLength
        ? minFontSize
        : maxFontSize -
          ((maxFontSize - minFontSize) * (textLength - minLineLength)) /
            (maxLineLength - minLineLength);

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
</script>

<template>
  <div
    class="card"
    :style="{ '--icon-bg': `url(/assets/icons/${card.iconId}.png)` }"
  >
    <div class="cost">{{ card.cost }}</div>

    <div class="name">
      {{ card.name }}
    </div>

    <p>{{ card.description }}</p>
  </div>
</template>

<style scoped lang="postcss">
.card {
  width: calc(1px * v-bind('config.CARD_WIDTH'));
  height: calc(1px * v-bind('config.CARD_HEIGHT'));
  background: url('/assets/ui/card.png'), var(--icon-bg);
  background-repeat: no-repeat, no-repeat;
  background-position:
    top left,
    53px 34px;
  background-size: cover cover;
  color: #311929;
  font-family: 'Silkscreen';
  user-select: none;
}

.cost {
  font-weight: bold;
  font-size: var(--font-size-5);
  position: absolute;
  right: 25px;
  top: -2px;
  -webkit-text-fill-color: #ffdaad;
  -webkit-text-stroke: 2px black;
}

.name {
  font-weight: bold;
  position: absolute;
  top: 162px;
  width: 100%;
  text-align: center;
  font-size: v-bind(nameFontSize);
}

p {
  font-family: 'Press Start 2P', system-ui;
  position: absolute;
  top: 200px;
  text-align: center;
  margin-inline: 44px;
  font-size: 8px;
  line-height: 1.5;
  text-wrap: balance;
}
</style>

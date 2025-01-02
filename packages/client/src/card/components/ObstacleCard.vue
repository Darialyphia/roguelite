<script setup lang="ts">
import type { CardViewModel } from '../card.model';
import { config } from '@/utils/config';
import StatCircle from './StatCircle.vue';
import { CARD_KINDS } from '@game/engine/src/card/card-enums';
import { match } from 'ts-pattern';
import { RUNES, type Rune } from '@game/engine/src/utils/rune';
import { useDynamicFontSize } from '@/shared/composables/useDynamicFontSize';
import type { CellViewModel } from '@/board/models/cell.model';
import type { Defined } from '@game/shared';

const { obstacle } = defineProps<{
  obstacle: Defined<CellViewModel['obstacle']>;
}>();

const nameFontSize = useDynamicFontSize(obstacle.name, {
  minFontSize: 10,
  maxFontSize: 21,
  maxLineLength: 30
});

const imagePath = computed(() => `url(/assets/icons/${obstacle.iconId}.png)`);

const metaString = computed(() => 'obstacle');
const metaFontSize = useDynamicFontSize(metaString, {
  minFontSize: 10,
  maxFontSize: 21,
  maxLineLength: 22
});
</script>

<template>
  <div class="card">
    <div class="name">{{ obstacle.name }}</div>
    <div class="description">{{ obstacle.description }}</div>
    <div class="meta">obstacle</div>
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
  grid-row: 2;
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
  grid-row: 3;
  width: calc(1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_WIDTH'));
  color: #5d1529;
  padding: calc(1px * v-bind('config.CARD_DESCRIPTION_TEXTBOX_PADDING'));
  justify-self: center;
  margin-top: 27px;
  line-height: 1.2;
  font-size: 12px;
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
}
</style>

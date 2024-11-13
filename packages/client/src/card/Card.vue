<script setup lang="ts">
import type { CardViewModel } from './card.model';

const { card } = defineProps<{ card: CardViewModel }>();
</script>

<template>
  <div class="card">
    <div class="cost">{{ card.cost }}</div>

    <div class="name">
      {{ card.name }}
    </div>

    <p>{{ card.description }}</p>
  </div>
</template>

<style scoped lang="postcss">
.card {
  width: 230px;
  height: 310px;
  background: url('/assets/ui/card.png');
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
  top: 160px;
  width: 100%;
  text-align: center;
  font-size: 14px;
}

p {
  font-family: 'VT323';
  position: absolute;
  top: 200px;
  text-align: center;
  margin-inline: 38px;
  font-size: 15px;
  line-height: 1.25;
}
</style>

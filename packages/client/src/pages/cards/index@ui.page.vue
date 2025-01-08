<script setup lang="ts">
import { CARDS_DICTIONARY } from '@game/engine/src/card/cards/_index';
import { CARD_KINDS } from '@game/engine/src/card/card-enums';
import { RouterLink } from 'vue-router';
import Card from '@/card/components/Card.vue';

definePage({
  name: 'CardsList'
});
</script>

<template>
  <div class="page">
    <nav class="pointer-events-auto">
      <ul class="flex gap-4">
        <li>
          <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Battle' }">Test Battle</RouterLink>
        </li>
      </ul>
    </nav>
    <ul>
      <li v-for="card in CARDS_DICTIONARY" :key="card.id">
        <Card
          :card="{
            name: card.name,
            description: card.description,
            cost: card.cost,
            iconId: card.iconId,
            kind: card.kind,
            unitType: card.kind === CARD_KINDS.UNIT ? card.unitType : undefined,
            atk: card.kind === CARD_KINDS.UNIT ? card.atk : undefined,
            maxHp: card.kind === CARD_KINDS.UNIT ? card.maxHp : undefined
          }"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="postcss">
.page {
  overflow: auto;
  height: 100dvh;
  pointer-events: auto;
}
ul {
  gap: var(--size-3);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
}
</style>

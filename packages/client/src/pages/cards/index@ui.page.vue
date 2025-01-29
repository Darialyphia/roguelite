<script setup lang="ts">
import { CARDS_DICTIONARY } from '@game/engine/src/card/cards/_index';
import {
  CARD_KINDS,
  CARD_SETS,
  type CardSet
} from '@game/engine/src/card/card-enums';
import { RouterLink } from 'vue-router';
import Card from '@/card/components/Card.vue';
import CardIcon from '@/card/components/CardIcon.vue';
import { useLocalStorage } from '@vueuse/core';
import UiButton from '@/ui/components/UiButton.vue';
import type { Nullable } from '@game/shared';
import type { CardBlueprint } from '@game/engine/src/card/card-blueprint';

definePage({
  name: 'CardsList'
});

const DECK_SIZE = 30;
const MAX_CARD_COPIES = 3;

const authorizedSets: CardSet[] = [CARD_SETS.CORE];

const cards = computed(() => {
  const byType = Object.groupBy(
    Object.values(CARDS_DICTIONARY).filter(c => authorizedSets.includes(c.set)),
    card => card.kind
  );

  return [
    ...byType.unit!.toSorted((a, b) => {
      const costDiff = a.cost.gold - b.cost.gold;
      if (costDiff) return costDiff;
      return a.name
        .toLocaleLowerCase()
        .localeCompare(b.name.toLocaleLowerCase());
    }),
    ...byType.spell!.toSorted((a, b) => {
      const costDiff = a.cost.gold - b.cost.gold;
      if (costDiff) return costDiff;
      return a.name
        .toLocaleLowerCase()
        .localeCompare(b.name.toLocaleLowerCase());
    }),
    ...byType.quest!.toSorted((a, b) => {
      const costDiff = a.cost.gold - b.cost.gold;
      if (costDiff) return costDiff;
      return a.name
        .toLocaleLowerCase()
        .localeCompare(b.name.toLocaleLowerCase());
    })
  ];
});

type Deck = {
  name: string;
  cards: string[];
};
const decks = useLocalStorage<Deck[]>('decks', []);

const createDeck = () => {
  decks.value.push({ name: `New Deck(${decks.value.length + 1})`, cards: [] });
  selectedDeck.value = decks.value.at(-1)!;
};
const selectedDeck = ref<Nullable<Deck>>(null);

const hasMaxCopies = (card: CardBlueprint) => {
  if (!selectedDeck.value) return false;
  return (
    selectedDeck.value.cards.filter(id => id === card.id).length >=
    MAX_CARD_COPIES
  );
};

const selectedDeckContent = computed(() => {
  if (!selectedDeck.value) return [];
  const deckCards = selectedDeck.value.cards.map(
    id => cards.value.find(card => card.id === id)!
  );

  const grouped = Object.groupBy(deckCards, card => card.id);
  return Object.entries(grouped)
    .map(([id, copies]) => ({
      id,
      name: copies![0].name,
      copies: copies!.length,
      blueprint: copies![0]
    }))
    .sort((a, b) => a.blueprint.cost.gold - b.blueprint.cost.gold);
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
          <RouterLink :to="{ name: 'SinglePlayer' }">Vs AI</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Sandbox' }">Sandbox</RouterLink>
        </li>
      </ul>
    </nav>
    <ul class="cards">
      <li v-for="card in cards" :key="card.id">
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
          :class="hasMaxCopies(card) && 'disabled'"
          @click="
            () => {
              if (!selectedDeck) return;
              const canAdd = !hasMaxCopies(card);
              if (!canAdd) return;
              selectedDeck.cards.push(card.id);
            }
          "
        />
      </li>
    </ul>
    <aside>
      <template v-if="!selectedDeck">
        <p v-if="!decks.length">You haven't created any deck yet.</p>

        <ul class="mb-5">
          <li
            v-for="(deck, index) in decks"
            :key="index"
            class="flex gap-2 items-center"
          >
            {{ deck.name }}
            <UiButton class="primary-button" @click="selectedDeck = deck">
              Edit
            </UiButton>
            <UiButton
              class="error-button"
              @click="decks.splice(decks.indexOf(deck), 1)"
            >
              Delete
            </UiButton>
          </li>
        </ul>
        <UiButton class="primary-button" @click="createDeck">New deck</UiButton>
      </template>
      <div class="deck" v-else>
        <div class="flex justiy-between">
          <input v-model="selectedDeck.name" />
          {{ selectedDeck.cards.length }} / {{ DECK_SIZE }}
        </div>
        <ul>
          <li
            v-for="card in selectedDeckContent"
            :key="card.id"
            class="deck-item"
            @click="
              () => {
                const idx = selectedDeck?.cards.findIndex(c => c === card.id)!;
                selectedDeck?.cards.splice(idx, 1);
              }
            "
          >
            <CardIcon :card="card.blueprint" />
            {{ card.name }} X {{ card.copies }}
          </li>
        </ul>
        <UiButton class="primary-button" @click="selectedDeck = null">
          Back
        </UiButton>
      </div>
    </aside>
  </div>
</template>

<style scoped lang="postcss">
.page {
  overflow: hidden;
  height: 100dvh;
  pointer-events: auto;
  display: grid;
  grid-template-columns: 1fr var(--size-xs);

  > nav {
    grid-column: 1 / -1;
  }
}

aside {
  padding: var(--size-3);
  overflow-y: hidden;
}
.cards {
  gap: var(--size-6);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  justify-items: center;
  overflow-y: auto;
}

.card.disabled {
  filter: grayscale(100%);
}

.card:not(.disabled):hover {
  cursor: url('/assets/ui/cursor-hover.png'), auto;
}

.deck {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  > ul {
    overflow-y: auto;
  }
}
.deck-item {
  display: flex;
  gap: var(--size-3);
  align-items: center;
  border: solid var(--border-size-1) #d7ad42;
  margin-block: var(--size-2);
  cursor: url('/assets/ui/cursor-hover.png'), auto;
  &:hover {
    filter: brightness(135%);
  }
}
</style>

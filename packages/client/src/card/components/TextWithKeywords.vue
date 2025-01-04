<script setup lang="ts">
import type { CardBlueprint } from '@game/engine/src/card/card-blueprint';
import { CARDS_DICTIONARY } from '@game/engine/src/card/cards/_index';
import { KEYWORDS, type Keyword } from '@game/engine/src/unit/keywords';
import { isString } from '@game/shared';
import Card from './Card.vue';
import {
  HoverCardRoot,
  HoverCardContent,
  HoverCardTrigger,
  HoverCardPortal
} from 'radix-vue';
import { CARD_KINDS } from '@game/engine/src/card/card-enums';

const { text, highlighted = true } = defineProps<{
  text: string;
  highlighted?: boolean;
}>();

const KEYWORD_DELIMITER = '@';

type Token =
  | { type: 'text'; text: string }
  | { type: 'keyword'; text: string; keyword: Keyword }
  | { type: 'card'; card: CardBlueprint; text: string };

const tokens = computed<Token[]>(() => {
  if (!text.includes(KEYWORD_DELIMITER)) return [{ type: 'text', text }];

  return text.split(KEYWORD_DELIMITER).map(part => {
    const keyword = Object.values(KEYWORDS).find(keyword => {
      return (
        part.toLowerCase().match(keyword.name.toLowerCase()) ||
        keyword.aliases.some(alias => {
          return isString(alias)
            ? part.toLowerCase().match(alias.toLowerCase())
            : part.toLowerCase().match(alias);
        })
      );
    });
    if (keyword) return { type: 'keyword', text: part, keyword };
    const card = Object.values(CARDS_DICTIONARY).find(c => c.name === part);
    if (card)
      return {
        type: 'card',
        text: part,
        card: card
      };

    return { type: 'text', text: part };
  });
});
</script>

<template>
  <span
    v-for="(token, index) in tokens"
    :key="index"
    :class="highlighted && `token-${token.type}`"
  >
    <HoverCardRoot :open-delay="500" :close-delay="0">
      <HoverCardTrigger>
        {{ token.text }}
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent v-if="highlighted" class="z-10">
          <article>
            <div v-if="token.type === 'keyword'" class="keyword-card">
              <div class="font-600">{{ token.keyword.name }}</div>
              <p class="text-0">{{ token.keyword.description }}</p>
            </div>
            <Card
              v-if="token.type === 'card'"
              :card="{
                name: token.card.name,
                description: token.card.description,
                cost: token.card.cost,
                iconId: token.card.iconId,
                kind: token.card.kind,
                atk:
                  token.card.kind === CARD_KINDS.UNIT
                    ? token.card.atk
                    : undefined,
                maxHp:
                  token.card.kind === CARD_KINDS.UNIT
                    ? token.card.maxHp
                    : undefined,
                reward:
                  token.card.kind === CARD_KINDS.UNIT
                    ? token.card.reward
                    : undefined
              }"
            />
          </article>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCardRoot>
  </span>
</template>

<style scoped lang="postcss">
:is(.token-keyword, .token-card) {
  font-weight: var(--font-weight-6);
}

.token-card {
  color: var(--cyan-2);
}

.keyword-card {
  font-size: var(--font-size-0);
  width: var(--size-14);
  padding: var(--size-3);
  color: var(--text-1);
  background-color: black;
  font-family: 'Silkscreen';
}
</style>

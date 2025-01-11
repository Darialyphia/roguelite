<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';

import ActionWheel from '@/player/components/ActionWheel.vue';
import Hand from '@/card/components/Hand.vue';
import PlayedCard from '@/card/components/PlayedCard.vue';
import BattleLog from '@/player/components/BattleLog.vue';
import MulliganOverlay from '@/card/components/MulliganOverlay.vue';
import PlayerBattleInfos from '@/player/components/PlayerBattleInfos.vue';
import OpponentHand from '@/card/components/OpponentHand.vue';
import TurnIndicator from '@/player/components/TurnIndicator.vue';
import { useGame, useUserPlayer } from '../stores/battle.store';
import { makePlayerViewModel } from '@/player/player.model';

const userPlayer = useUserPlayer();

const opponent = computed(() =>
  makePlayerViewModel(game.value, userPlayer.value.getPlayer().opponents[0])
);

const game = useGame();
</script>

<template>
  <Fps />
  <div class="layout">
    <MulliganOverlay />
    <PlayedCard />
    <TurnIndicator />

    <header>
      <PlayerBattleInfos :player="userPlayer" class="player-battle-infos" />
      <OpponentHand class="opponent-hand" />
      <PlayerBattleInfos
        :player="opponent"
        class="opponent-battle-infos"
        inverted
      />
    </header>

    <BattleLog class="pointer-events-auto" />

    <footer class="bottom-row">
      <ActionWheel />
      <Hand class="hand" />
      <div />
    </footer>
  </div>
</template>

<style scoped lang="postcss">
.layout {
  display: grid;
  height: 100dvh;
  grid-template-rows: 1fr 1fr;
  user-select: none;
}

header,
footer {
  display: grid;
  grid-template-columns: minmax(0, 0.25fr) minmax(0, 0.5fr) minmax(0, 0.25fr);
}

.action-wheel {
  align-self: end;
  margin-block-end: var(--size-9);
  margin-inline-start: var(--size-11);
}

.hand,
.opponent-hand {
  width: 100%;
  justify-self: center;
}

.opponent-hand {
  margin-top: -350px;
}

.player-battle-infos {
  align-self: start;
  justify-self: start;
}

.opponent-battle-infos {
  justify-self: end;
  align-self: start;
}
</style>

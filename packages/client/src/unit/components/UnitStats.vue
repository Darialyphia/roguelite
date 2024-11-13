<script setup lang="ts">
import type { UnitViewModel } from '../unit.model';
import UnitIcon from './UnitIcon.vue';

const { unit } = defineProps<{ unit: UnitViewModel }>();

const hpPercentage = computed(() => (unit.currentHp / unit.maxHp) * 100);
const apPercentage = computed(() => (unit.currentAp / unit.maxAp) * 100);

const tweened = reactive({
  hp: unit.currentHp,
  ap: unit.currentAp
});
watch(
  () => unit,
  () => {
    gsap.to(tweened, {
      hp: unit.currentHp,
      ap: unit.currentAp,
      duration: 0.5,
      ease: Power3.easeOut
    });
  }
);
</script>

<template>
  <section class="unit-stats">
    <header>
      <UnitIcon :unit="unit" />
      {{ unit.name }}
    </header>

    <dl>
      <div class="stat">
        <dt class="hp">HP</dt>
        <div class="bar" :style="{ '--percentage': hpPercentage }" />
        <dd>{{ tweened.hp.toFixed() }} / {{ unit.maxHp }}</dd>
        <dt class="ap">AP</dt>
        <div class="bar" :style="{ '--percentage': apPercentage }" />
        <dd>{{ tweened.ap.toFixed() }} / {{ unit.maxAp }}</dd>
      </div>

      <div class="flex gap-3 justify-between">
        <div class="stat">
          <dt class="patk">PATK</dt>
          <dd>{{ unit.pAtk }}</dd>
        </div>
        <div class="stat">
          <dt class="matk">MATK</dt>
          <dd>{{ unit.mAtk }}</dd>
        </div>
      </div>

      <div class="flex gap-3 justify-between">
        <div class="stat">
          <dt class="pdef">PDEF</dt>
          <dd>{{ unit.pDef }}</dd>
        </div>
        <div class="stat">
          <dt class="mdef">MDEF</dt>
          <dd>{{ unit.mDef }}</dd>
        </div>
      </div>
    </dl>
  </section>
</template>

<style scoped lang="postcss">
.unit-stats {
  font-family: 'Silkscreen';
  color: #ffdaad;
  user-select: none;
  background-color: #311929aa;
  padding: var(--size-5);
  border: solid 6px #ffdaad;
  border-right-color: #b59a79;
  border-bottom-color: #b59a79;
}

header {
  display: flex;
  align-items: flex-end;
  gap: var(--size-4);
  font-size: var(--font-size-5);
  line-height: 1;
  margin-bottom: var(--size-2);
}

.stat {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--size-3);

  &:has(.bar) {
    grid-template-columns: auto 1fr auto;
  }

  :not(:has(.bar)) {
    :nth-child(even) {
      justify-self: end;
    }
  }
}

.bar {
  background: #090d18;
  position: relative;
  height: 12px;
  align-self: center;
  border-radius: var(--radius-pill);
  overflow: hidden;
  box-shadow: 0 3px 4px hsl(0 0 0 / 0.5);
  &::after {
    content: '';
    position: absolute;
    height: 100%;
    transition: width 0.5s var(--ease-out-3);
    width: calc(1% * var(--percentage));
    background: linear-gradient(
      to right in oklab,
      var(--start-color),
      var(--mid-color),
      var(--end-color)
    );
  }
}

.hp ~ .bar {
  --start-color: #e5233e;
  --mid-color: #ffe822;
  --end-color: #4ab907;
}

.ap ~ .bar {
  --start-color: #662fe1;
  --mid-color: #2ea3ea;
  --end-color: #00fff1;
}

dt {
  --icon-size: 24px;
  margin-block: var(--size-1);
  position: relative;
  padding-left: calc(var(--icon-size) + 4px);
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: var(--icon-size);
    aspect-ratio: 1;
    background: var(--icon-bg);
    background-size: cover;
  }
}

.hp {
  --icon-bg: url('/assets/ui/hp.png');
}
.ap {
  --icon-bg: url('/assets/ui/ap.png');
}
.patk {
  --icon-bg: url('/assets/ui/p-atk.png');
}
.matk {
  --icon-bg: url('/assets/ui/m-atk.png');
}
.pdef {
  --icon-bg: url('/assets/ui/p-def.png');
}
.mdef {
  --icon-bg: url('/assets/ui/m-def.png');
}
</style>

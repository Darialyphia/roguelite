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
    <dl>
      <header>
        <UnitIcon :unit="unit" />
        <div>
          {{ unit.name }}

          <div class="stat">
            <dt class="hp">HP</dt>
            <div class="bar" :style="{ '--percentage': hpPercentage }" />
            <dd>{{ tweened.hp.toFixed() }} / {{ unit.maxHp }}</dd>
            <dt class="ap">AP</dt>
            <div class="bar" :style="{ '--percentage': apPercentage }" />
            <dd>{{ tweened.ap.toFixed() }} / {{ unit.maxAp }}</dd>
          </div>
        </div>
      </header>

      <div class="flex gap-3 justify-between">
        <div class="stat">
          <dt class="patk"><span class="sr-only">PATK</span></dt>
          <dd>{{ unit.pAtk }}</dd>
        </div>
        <div class="stat">
          <dt class="matk"><span class="sr-only">MATK</span></dt>
          <dd>{{ unit.mAtk }}</dd>
        </div>
        <div class="stat">
          <dt class="pdef"><span class="sr-only">PDEF</span></dt>
          <dd>{{ unit.pDef }}</dd>
        </div>
        <div class="stat">
          <dt class="mdef"><span class="sr-only">MDEF</span></dt>
          <dd>{{ unit.mDef }}</dd>
        </div>
        <div class="stat">
          <dt class="speed"><span class="sr-only">SPD</span></dt>
          <dd>{{ unit.speed }}</dd>
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
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--size-4);
  font-size: var(--font-size-5);
  line-height: 1;
  margin-bottom: var(--size-2);
}

.stat {
  display: grid;
  font-size: var(--font-size-1);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--size-3);

  &:has(.bar) {
    grid-template-columns: auto 1fr auto;
    font-size: var(--font-size-0);
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
  clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0% 100%);
  overflow: hidden;
  box-shadow: 0 3px 4px hsl(0 0 0 / 0.5);
  min-width: var(--size-11);
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
  font-weight: var(--font-weight-4);
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

dd {
  margin-block: var(--size-1);
  font-weight: var(--font-weight-7);
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
.speed {
  --icon-bg: url('/assets/ui/speed.png');
}
</style>

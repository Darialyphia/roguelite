<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';
import { useBattleUiStore } from './battle-ui.store';
definePage({
  name: 'Battle'
});

const { parts } = useBattleUiStore();
</script>

<template>
  <Fps />
  <nav class="ml-11 mt-4">
    <ul class="flex gap-4">
      <li class="pointer-events-auto">
        <RouterLink :to="{ name: 'Home' }">Back to Home</RouterLink>
      </li>
    </ul>
  </nav>
  <fieldset
    v-for="(part, name) in parts"
    :key="name"
    class="mt-4 ml-5 pointer-events-auto"
  >
    <legend>{{ name }}</legend>
    <div class="flex gap-3">
      <label>
        <input v-model="parts[name]" :value="null" type="radio" :name="name" />
        Take off
      </label>
      <label>
        <input v-model="parts[name]" value="tier1" type="radio" :name="name" />
        Tier 1
      </label>
      <label>
        <input v-model="parts[name]" value="tier2" type="radio" :name="name" />
        Tier 2
      </label>
      <label>
        <input v-model="parts[name]" value="tier3" type="radio" :name="name" />
        Tier 3
      </label>
      <label>
        <input v-model="parts[name]" value="tier4" type="radio" :name="name" />
        Tier 4
      </label>
    </div>
  </fieldset>
</template>

<style scoped lang="postcss">
fieldset {
  background-color: #222;
  width: fit-content;
  padding: var(--size-3);
}
</style>

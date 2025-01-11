<script setup lang="ts">
import { RouterLink } from 'vue-router';
definePage({
  name: 'Home',
  path: '/'
});
</script>

<template>
  <h1>Home Page</h1>
  <nav class="pointer-events-auto">
    <ul class="flex gap-4">
      <li>
        <RouterLink :to="{ name: 'Settings' }">Settings</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Battle' }">Test Battle</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'Tutorial1' }">Tutorial</RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'CardsList' }">Cards List</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="postcss"></style>

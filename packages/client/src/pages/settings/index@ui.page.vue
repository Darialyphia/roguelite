<script setup lang="ts">
import { RouterLink } from 'vue-router';
definePage({
  name: 'Settings'
});
</script>

<template>
  <h1>Settings page</h1>
  <RouterLink :to="{ name: 'Home' }" class="pointer-events-auto">
    Back to Home
  </RouterLink>
</template>

<style scoped lang="postcss"></style>

<script setup lang="ts">
import Fps from '@/shared/components/Fps.vue';

definePage({
  name: 'Battle'
});
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
</template>

<style scoped lang="postcss"></style>

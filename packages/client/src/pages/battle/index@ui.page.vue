<script setup lang="ts">
definePage({
  name: 'Battle'
});
</script>

<template>
  <h1>Test Battle Page</h1>
  <nav>
    <ul class="flex gap-4">
      <li class="pointer-events-auto">
        <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="postcss"></style>

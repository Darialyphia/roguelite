<script setup lang="ts">
definePage({
  name: 'Settings'
});
</script>

<template>
  <h1>Settings page</h1>
  <RouterLink :to="{ name: 'Home' }">Back to Home</RouterLink>
</template>

<style scoped lang="postcss"></style>

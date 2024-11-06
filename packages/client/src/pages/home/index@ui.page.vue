<script setup lang="ts">
definePage({
  name: 'Home',
  path: '/'
});
</script>

<template>
  <h1>Home Page</h1>
  <RouterLink :to="{ name: 'Settings' }">Settings</RouterLink>
</template>

<style scoped lang="postcss"></style>

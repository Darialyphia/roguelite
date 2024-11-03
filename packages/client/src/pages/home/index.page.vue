<script setup lang="ts">
import { HomeScene } from './home.scene';

definePage({
  name: 'Home',
  path: '/',
  meta: {
    scene: HomeScene
  }
});
</script>

<template>
  <h1>Home Page</h1>
  <RouterLink :to="{ name: 'Settings' }">Settings</RouterLink>
</template>

<style scoped lang="postcss"></style>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/statistics">Statistics</RouterLink>
    <RouterLink to="/export">Export</RouterLink>
  </nav>

  <RouterView />
</template>

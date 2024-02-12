<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="mb-4">
    <RouterLink to="/">Transactions</RouterLink>
    <RouterLink to="/categories">Categories</RouterLink>
    <RouterLink to="/statistics">Statistics</RouterLink>
    <RouterLink to="/export">Export</RouterLink>
  </nav>

  <RouterView />
</template>

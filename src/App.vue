<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useTheme } from 'vuetify'

const theme = useTheme()
theme.global.name.value = 'dark'

// function toggleTheme() {
//   theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
// }

</script>

<template>
  <nav class="mb-4">
    <RouterLink to="/">Transactions</RouterLink>
    <RouterLink to="/categories">Categories</RouterLink>
    <RouterLink to="/statistics">Statistics</RouterLink>
    <RouterLink to="/export">Export/Import</RouterLink>
    <!-- <v-btn @click="toggleTheme">toggle theme</v-btn> -->
  </nav>

  <RouterView />
</template>

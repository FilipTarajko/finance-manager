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
    <RouterLink :to="{ name: 'categories' }">Categories</RouterLink>
    <RouterLink :to="{ name: 'transactions' }">Transactions</RouterLink>
    <RouterLink :to="{ name: 'statistics' }">Statistics</RouterLink>
    <RouterLink :to="{ name: 'export' }">Export/Import</RouterLink>
    <!-- <v-btn @click="toggleTheme">toggle theme</v-btn> -->
  </nav>

  <RouterView />
</template>

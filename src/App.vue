<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from "@/stores/themeStore"
const themeStore = useThemeStore()
</script>

<template>
  <nav class="mb-4" style="display: flex; flex-direction: row; justify-content: space-between; align-items: baseline;">
    <RouterLink class="routerLink routerLink--left" :to="{ name: 'categories' }">Categories</RouterLink>
    <RouterLink class="routerLink" :to="{ name: 'transactions' }">Transactions</RouterLink>
    <RouterLink class="routerLink" :to="{ name: 'accounts' }">Accounts</RouterLink>
    <RouterLink class="routerLink" :to="{ name: 'currencies' }">Currencies</RouterLink>
    <RouterLink class="routerLink" :to="{ name: 'statistics' }">Statistics</RouterLink>
    <RouterLink class="routerLink" :to="{ name: 'importexport' }">Import/Export</RouterLink>
    <v-btn @click="themeStore.toggleTheme">toggle theme</v-btn>
  </nav>

  <RouterView />
</template>

<style scoped lang="scss">
.routerLink {
  $padding-size: 1rem;
  padding: $padding-size;

  &--left {
    margin-left: -$padding-size
  }
}
</style>
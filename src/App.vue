<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from "@/stores/themeStore"
import { useSnackbarStore } from './stores/snackbarStore';

const themeStore = useThemeStore()
const snackbarStore = useSnackbarStore()
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
  <div class="text-center ma-2">
    <v-snackbar
      :color=snackbarStore.snackbarColor
      v-model="snackbarStore.isSnackbarDisplayed"
    >
      <span style="word-break: break-all;">
        {{ snackbarStore.snackbarText }}
      </span>

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbarStore.isSnackbarDisplayed = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
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
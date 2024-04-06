<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from "@/stores/themeStore"
import { useSnackbarStore } from './stores/snackbarStore';
import { ref, type Ref } from 'vue';

const themeStore = useThemeStore()
const snackbarStore = useSnackbarStore()

const drawer: Ref<any> = ref(null);
</script>

<template>
  <v-layout>
    <v-app-bar app color="green" style="width: 100%;">
      <div
        style="margin: auto; padding: 0 1rem; width: 100%; max-width: 1000px; display: flex; justify-content: space-between; align-items: baseline;">
        <v-btn class="display-if-narrow-screen" variant="outlined" style="min-width: 0px; width: 50px;"
          @click.stop="drawer = !drawer">
          <v-icon icon="mdi-menu"></v-icon>
        </v-btn>
        <div>
          <v-toolbar-title style="font-size: 1.4rem;">Finance Manager</v-toolbar-title>
        </div>
        <nav class="display-if-not-narrow-screen"
          style="flex-direction: row; justify-content: space-between; align-items: baseline;">
          <RouterLink class="routerLink routerLink--left" :to="{ name: 'categories' }">Categories</RouterLink>
          <RouterLink class="routerLink" :to="{ name: 'transactions' }">Transactions</RouterLink>
          <RouterLink class="routerLink" :to="{ name: 'accounts' }">Accounts</RouterLink>
          <RouterLink class="routerLink" :to="{ name: 'currencies' }">Currencies</RouterLink>
          <RouterLink class="routerLink" :to="{ name: 'statistics' }">Statistics</RouterLink>
          <RouterLink class="routerLink" :to="{ name: 'importexport' }">Import/Export</RouterLink>
        </nav>
        <v-btn variant="outlined" style="min-width: 0px; width: 50px;" @click="themeStore.toggleTheme">
          <v-icon icon="mdi-theme-light-dark"></v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer id="drawer" v-model="drawer" temporary>
      <v-list density="compact" nav style="display: flex; flex-direction: column;">
        <v-btn style="margin: 0.5rem;" color="primary" @click.stop="drawer = false">
          Close
        </v-btn>
        <!-- <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item> -->
        <RouterLink class="routerLink" :to="{ name: 'categories' }">
          <v-icon color="primary" icon="mdi-shape"></v-icon>
          Categories
        </RouterLink>
        <RouterLink class="routerLink" :to="{ name: 'transactions' }">
          <v-icon icon="mdi-dots-grid"></v-icon>
          Transactions
        </RouterLink>
        <RouterLink class="routerLink" :to="{ name: 'accounts' }">
          <v-icon color="warning" icon="mdi-credit-card"></v-icon>
          Accounts
        </RouterLink>
        <RouterLink class="routerLink" :to="{ name: 'currencies' }">
          <v-icon color="yellow" icon="mdi-currency-usd"></v-icon>
          Currencies
        </RouterLink>
        <RouterLink class="routerLink" :to="{ name: 'statistics' }">
          <v-icon color="green" icon="mdi-chart-bar"></v-icon>
          Statistics
        </RouterLink>
        <RouterLink class="routerLink" :to="{ name: 'importexport' }">
          <v-icon color="cyan" icon="mdi-export"></v-icon>
          Import/Export
        </RouterLink>
      </v-list>
    </v-navigation-drawer>
  </v-layout>

  <RouterView style='margin-top: 4rem;' />
  <div class="text-center ma-2">
    <v-snackbar :color=snackbarStore.snackbarColor v-model="snackbarStore.isSnackbarDisplayed">
      <span style="word-break: break-all;">
        {{ snackbarStore.snackbarText }}
      </span>

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbarStore.isSnackbarDisplayed = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
.routerLink {
  padding: 0.35rem 0.7rem;
  margin-bottom: -0.2rem;

  &--left {
    margin-left: -0.7rem;
  }
}

nav>.routerLink {
  color: white;
  // border: 1px solid white;
}

#drawer .routerLink {
  margin: 0.3rem;
}

.routerLink>.v-icon {
  margin-right: 0.5rem;
}

.display-if-narrow-screen {
  display: none;
}

@media (max-width: 900px) {
  .display-if-narrow-screen {
    display: block;
  }
}

.display-if-not-narrow-screen {
  display: flex;
}

@media (max-width: 900px) {
  .display-if-not-narrow-screen {
    display: none;
  }
}
</style>
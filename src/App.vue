<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/themeStore'
import { useSnackbarStore } from './stores/snackbarStore'
import { computed, ref, type Ref } from 'vue'
import { onUnmounted } from 'vue'
import navbarRoutes from './router/navbarRoutes.json'

const BREAKPOINT_WIDTH = 900
const themeStore = useThemeStore()
const snackbarStore = useSnackbarStore()
const drawer: Ref<any> = ref(null)

const topBarLinkTabIndex = computed(() => {
  return width.value > BREAKPOINT_WIDTH ? 0 : -1
})

const drawerLinkTabIndex = computed(() => {
  return drawer.value ? 0 : -1
})

let width = ref(window.innerWidth)

function updateWindowWidth() {
  width.value = window.innerWidth
}

window.addEventListener('resize', updateWindowWidth)

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<template>
  <v-layout>
    <v-app-bar app color="green" style="width: 100%">
      <div
        style="
          margin: auto;
          padding: 0 1rem;
          width: 100%;
          max-width: 1000px;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        "
      >
        <a class="skip-nav-link" href="#main-content" tabindex="0" aria-hidden="false">
          skip navigation
        </a>
        <v-btn
          class="display-if-narrow-screen"
          variant="outlined"
          style="min-width: 0px; width: 50px"
          @click.stop="drawer = !drawer"
        >
          <v-icon icon="mdi-menu"></v-icon>
        </v-btn>
        <div>
          <v-toolbar-title style="font-size: 1.4rem">
            <RouterLink id="logo" to="/" tabindex="0"> Finance Manager </RouterLink>
          </v-toolbar-title>
        </div>
        <nav
          class="display-if-not-narrow-screen"
          style="flex-direction: row; justify-content: space-between; align-items: baseline"
        >
          <RouterLink
            v-for="route in navbarRoutes"
            class="layoutRouterLink"
            :to="{ name: route.routeName }"
            :tabindex="topBarLinkTabIndex"
          >
            {{ route.displayName }}
          </RouterLink>
        </nav>
        <v-btn
          variant="outlined"
          style="min-width: 0px; width: 50px"
          @click="themeStore.toggleTheme"
        >
          <v-icon icon="mdi-theme-light-dark"></v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer id="drawer" v-model="drawer" temporary>
      <v-list density="compact" nav style="display: flex; flex-direction: column" tabindex="-1">
        <v-btn
          style="margin: 0.5rem"
          color="primary"
          @click.stop="drawer = false"
          :tabindex="drawerLinkTabIndex"
        >
          Close
        </v-btn>
        <!-- <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item> -->
        <RouterLink
          v-for="route in navbarRoutes"
          class="layoutRouterLink"
          :to="{ name: route.routeName }"
          :tabindex="drawerLinkTabIndex"
        >
          <v-icon :icon="route.icon" :color="route.color"></v-icon>
          {{ route.displayName }}
        </RouterLink>
      </v-list>
    </v-navigation-drawer>
  </v-layout>

  <RouterView id="main-content" style="margin-top: 4rem" />
  <div class="text-center ma-2">
    <v-snackbar :color="snackbarStore.snackbarColor" v-model="snackbarStore.isSnackbarDisplayed">
      <span style="word-break: break-all">
        {{ snackbarStore.snackbarText }}
      </span>

      <template v-slot:actions>
        <v-btn variant="text" @click="snackbarStore.isSnackbarDisplayed = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped lang="scss">
#logo {
  color: white;
  background: none !important;
}

.skip-nav-link {
  position: absolute;
  top: 0px;
  display: absolute;
  color: #4caf50;

  &:focus {
    color: white;
  }
}

.layoutRouterLink {
  padding: 0.35rem 0.7rem;
  margin-bottom: -0.2rem;

  &:first-child {
    margin-left: -0.7rem;
  }
}

nav > .layoutRouterLink {
  color: white;
  // border: 1px solid white;
}

.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.4rem;
}

.v-list .layoutRouterLink {
  background-color: rgba(130, 130, 130, 0.05);
  border-radius: 0.4rem;
}

.v-list .router-link-exact-active {
  background-color: rgba(150, 150, 150, 0.2);
  border-radius: 0.4rem;
}

#drawer .layoutRouterLink {
  margin: 0.3rem;
}

.layoutRouterLink > .v-icon {
  margin-right: 0.5rem;
}

.display-if-narrow-screen {
  display: none;
}

.display-if-not-narrow-screen {
  display: flex;
}

@media (max-width: 900px) {
  .display-if-narrow-screen {
    display: block;
  }
  .display-if-not-narrow-screen {
    display: none;
  }
  .skip-nav-link {
    left: 70px;
  }
}
</style>

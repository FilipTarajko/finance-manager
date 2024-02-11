<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()
</script>

<template>
  <main>
    <h1>Categories</h1>
    <ul>
      <li
        v-for="category of categoriesStore.categories"
        :key="category.id"
        :style="{ color: category.color }"
      >
        {{ category.id }} - {{ category.name }}
      </li>
    </ul>
  </main>
</template>

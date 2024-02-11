<script setup lang="ts">
import newCategoryForm from "@/components/NewCategoryForm.vue"
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()
</script>

<template>
  <main>
    <h1>Categories</h1>
    <newCategoryForm></newCategoryForm>
    <h2>categories list</h2>
    <ul>
      <li v-for="category of categoriesStore.categories" :key="category.id" :style="{ color: category.color }">
        {{ category.id }} - {{ category.name }}
      </li>
    </ul>
  </main>
</template>

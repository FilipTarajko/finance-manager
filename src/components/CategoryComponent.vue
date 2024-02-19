<script setup lang="ts">
import type { Category } from '@/types/types'
import { useCategoriesStore } from "@/stores/categoriesStore"
const categoriesStore = useCategoriesStore();

defineProps<{
  category: Category,
  showDialog: Function
}>()

</script>


<template>
  <RouterLink :to="'/categories/' + category.id">{{ category.name }}</RouterLink>
  <v-icon
    :icon="category.icon"
    :color="category.color"
  />
  <v-icon
    @click="showDialog(category)"
    class="edit-button"
    icon="mdi-pencil"
    aria-label="edit category"
    style="color: yellow"
  />
  <v-icon
    @click="categoriesStore.deleteCategory(category)"
    icon="mdi-delete"
    aria-label="delete category"
    style="color: red"
  />
</template>
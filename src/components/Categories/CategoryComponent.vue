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
  <div style="display: flex; flex-direction: row;">
  <div style="width: 25ch;">
    <v-icon
    :icon="category.icon"
    :color="category.color"
    /> <RouterLink :to="'/categories/' + category.id">{{ category.name }}</RouterLink>
  </div>
  <div style="width: 6ch;">
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
  </div>
</div>
</template>
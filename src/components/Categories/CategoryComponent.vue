<script setup lang="ts">
import type { Category } from '@/types/types'
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

defineProps<{
  category: Category
  showDialog: Function
}>()
</script>

<template>
  <div style="display: grid; max-width: 46ch; grid-template-columns: auto 6ch">
    <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden">
      <RouterLink :to="'/categories/' + category.id" tabindex="0">
        <v-icon :icon="category.icon" :color="category.color" />
        {{ category.name }}
      </RouterLink>
    </div>
    <div>
      <button @click="showDialog(category)" class="edit-button" aria-label="edit category">
        <v-icon icon="mdi-pencil" style="color: var(--visible-yellow)" />
      </button>
      <button @click="categoriesStore.deleteCategory(category)" aria-label="delete category">
        <v-icon icon="mdi-delete" style="color: red" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryForm from '@/components/Categories/CategoryForm.vue'
import CategoryEditDialog from '@/components/Categories/CategoryEditDialog.vue'
import CategoryComponent from '@/components/Categories/CategoryComponent.vue'
import { useCategoriesStore } from '@/stores/categoriesStore'
import type { Category } from '@/types/types'
import { ref, type Ref } from 'vue'
const categoriesStore = useCategoriesStore()

const isDialogShown = ref(false)
const editedCategory: Ref<Category | null> = ref(null)

function showDialog(category: Category) {
  editedCategory.value = category
  isDialogShown.value = true
}
</script>

<template>
  <main>
    <h1>Categories</h1>
    <CategoryForm></CategoryForm>
    <h2>categories list</h2>
    <div v-if="categoriesStore.categories.length > 0">
      <div v-for="category of categoriesStore.categories" :key="category.id">
        <CategoryComponent :category="category" @showDialog="showDialog"></CategoryComponent>
      </div>
    </div>
    <div v-else>There are no categories</div>
    <CategoryEditDialog v-model="isDialogShown" :editedCategory="editedCategory">
    </CategoryEditDialog>
  </main>
</template>

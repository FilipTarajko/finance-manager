<script setup lang="ts">
import CategoryForm from '@/components/CategoryForm.vue'
import CategoryEditDialog from '@/components/CategoryEditDialog.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import { useCategoriesStore } from '@/stores/categoriesStore'
import type { Category } from '@/types/types'
import { ref, type Ref } from 'vue'
const categoriesStore = useCategoriesStore()

let isDialogShown = ref(false)
let editedCategory: Ref<Category | null> = ref(null)

function showDialog(category: Category) {
  editedCategory.value = category
  isDialogShown.value = true
}

function hideDialog() {
  isDialogShown.value = false
}
</script>

<template>
  <main>
    <h1>Categories</h1>
    <CategoryForm></CategoryForm>
    <h2>categories list</h2>
    <ul v-if="categoriesStore.categories.length > 0">
      <li
        v-for="category of categoriesStore.categories"
        :key="category.id"
        :style="{ color: category.color, 'list-style': 'none' }"
      >
        <CategoryComponent
          :category="category"
          :showDialog="showDialog"
        ></CategoryComponent>
      </li>
    </ul>
    <div v-else>
      There are no categories
    </div>
    <CategoryEditDialog
      v-model="isDialogShown"
      :hideDialog="hideDialog"
      :editedCategory="editedCategory"
    >
    </CategoryEditDialog>
  </main>
</template>

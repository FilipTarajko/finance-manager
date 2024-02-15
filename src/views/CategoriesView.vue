<script setup lang="ts">
import categoryForm from '@/components/CategoryForm.vue'
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
    <categoryForm></categoryForm>
    <h2>categories list</h2>
    <ul>
      <li
        v-for="category of categoriesStore.categories"
        :key="category.id"
        :style="{ color: category.color, 'list-style': 'none' }"
      >
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
      </li>
    </ul>
    <v-dialog
      width="auto"
      v-model="isDialogShown"
    >
      <v-card theme="dark">
        <v-card-text>
          <categoryForm
            :category="editedCategory"
            :hideDialog="hideDialog"
          > </categoryForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </main>
</template>

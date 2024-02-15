<script setup lang="ts">
import CategoryForm from '@/components/CategoryForm.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import { useCategoriesStore } from '../stores/categoriesStore'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const categoriesStore = useCategoriesStore()
const route = useRoute()

let isDialogShown = ref(false)

function showDialog() {
  isDialogShown.value = true
}

function hideDialog() {
  isDialogShown.value = false
}

const category = computed(() => {
  return categoriesStore.categories.find((e) => e.id == (route.params.categoryId as any))
})
</script>

<template>
  <main>
    <h1>Category</h1>
    <template v-if="category">
      <CategoryComponent
        :category="category"
        :showDialog="showDialog"
      ></CategoryComponent>
      <v-dialog
        width="auto"
        v-model="isDialogShown"
      >
        <v-card theme="dark">
          <v-card-text>
            <CategoryForm
              :category="category"
              :hideDialog="hideDialog"
            > </CategoryForm>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

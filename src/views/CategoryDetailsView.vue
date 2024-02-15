<script setup lang="ts">
import categoryForm from '@/components/CategoryForm.vue'
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
      {{ category.name }}
      <v-icon
        :icon="category.icon"
        :color="category.color"
      />
      <v-icon
        @click="showDialog()"
        class="edit-button"
        icon="mdi-pencil"
        aria-label="edit category"
        style="color: yellow"
      />
      <v-dialog
        width="auto"
        v-model="isDialogShown"
      >
        <v-card theme="dark">
          <v-card-text>
            <categoryForm
              :category="category"
              :hideDialog="hideDialog"
            > </categoryForm>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

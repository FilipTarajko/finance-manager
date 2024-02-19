<script setup lang="ts">
import CategoryForm from '@/components/Categories/CategoryForm.vue'
import type { Category } from '@/types/types';
import type { Ref } from 'vue';

const isDialogShown: Ref<boolean | undefined> = defineModel()

defineProps<{
  hideDialog: Function,
  editedCategory: Category | null
}>()
</script>

<template>
  <v-dialog
    width="auto"
    v-model="isDialogShown"
  >
    <v-card>
      <v-card-text>
        <CategoryForm
          :category="editedCategory"
          :hideDialog="hideDialog"
        > </CategoryForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
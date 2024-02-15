<script setup lang="ts">
import type { TransactionWithCategoryData } from '@/types/types';
import TransactionForm from '@/components/TransactionForm.vue'
import { type Ref } from 'vue';

const isDialogShown: Ref<boolean | undefined> = defineModel()

defineProps<{
  hideDialog: Function,
  transaction: TransactionWithCategoryData | null
}>()


</script>

<template>
  <v-dialog
    width="auto"
    v-model="isDialogShown"
  >
    <v-card>
      <v-card-text>
        <TransactionForm
          :transaction="transaction"
          :hideDialog="hideDialog"
        >
        </TransactionForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
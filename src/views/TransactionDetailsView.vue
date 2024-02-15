<script setup lang="ts">
import { useCategoriesStore } from '../stores/categoriesStore'
import TransactionEditDialog from '@/components/TransactionEditDialog.vue'
import TransactionComponent from '@/components/TransactionComponent.vue'
import type { TransactionWithCategoryData } from '@/types/types';
import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
const categoriesStore = useCategoriesStore()
const route = useRoute()

let isDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

function showDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isDialogShown.value = true
}

function hideDialog() {
  isDialogShown.value = false
}

const transaction = computed(() => {
  return categoriesStore.transactions.find((e) => e.id == (route.params.transactionId as any))
})
</script>

<template>
  <main>
    <h1>Transaction</h1>
    <template v-if="transaction">
      <TransactionComponent
        :transaction=transaction
        :showDialog=showDialog
      ></TransactionComponent>
      <TransactionEditDialog
        v-model=isDialogShown
        :hideDialog="hideDialog"
        :transaction="transaction"
      ></TransactionEditDialog>
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

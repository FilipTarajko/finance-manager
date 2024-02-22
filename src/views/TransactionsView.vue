<script setup lang="ts">
import TransactionForm from '@/components/Transactions/TransactionForm.vue'
import TransactionList from '@/components/Transactions/TransactionList.vue'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import { ref, type Ref } from 'vue'
import type { TransactionWithCategoryData } from '@/types/types'
import { useCategoriesStore } from '@/stores/categoriesStore';
const categoriesStore = useCategoriesStore()

let isDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

function showDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isDialogShown.value = true
}
</script>

<template>
  <main>
    <h1>Transactions</h1>
    <TransactionForm />
    <h2>transaction history</h2>
    <TransactionList
      :transactions="categoriesStore.transactions"
      :showDialog="showDialog"
    ></TransactionList>
    <TransactionEditDialog
      v-model=isDialogShown
      :transaction="dialogTransaction"
    ></TransactionEditDialog>
  </main>
</template>

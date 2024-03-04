<script setup lang="ts">
import TransactionForm from '@/components/Transactions/TransactionForm.vue'
import TransactionList from '@/components/Transactions/TransactionList.vue'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import { useCategoriesStore } from '@/stores/categoriesStore';
const categoriesStore = useCategoriesStore()

import { useTransactionFormComposable } from "@/composables/transactionFormComposable";
let { isTransactionDialogShown, dialogTransaction, showTransactionDialog } = useTransactionFormComposable();

</script>

<template>
  <main>
    <h1>Transactions</h1>
    <TransactionForm />
    <h2>transaction history</h2>
    <TransactionList
      :transactions="categoriesStore.transactions"
      :showDialog="showTransactionDialog"
    ></TransactionList>
    <TransactionEditDialog
      v-model=isTransactionDialogShown
      :transaction="dialogTransaction"
    ></TransactionEditDialog>
  </main>
</template>

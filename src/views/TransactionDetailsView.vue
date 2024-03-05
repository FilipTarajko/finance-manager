<script setup lang="ts">
import { useCategoriesStore } from '../stores/categoriesStore'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import TransactionComponent from '@/components/Transactions/TransactionComponent.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const categoriesStore = useCategoriesStore()
const route = useRoute()

import { useTransactionFormComposable } from "@/composables/transactionFormComposable";
const { isTransactionDialogShown, dialogTransaction, showTransactionDialog } = useTransactionFormComposable();

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
        :showDialog=showTransactionDialog
      ></TransactionComponent>
      <TransactionEditDialog
        v-model=isTransactionDialogShown
        :transaction="dialogTransaction"
      ></TransactionEditDialog>
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

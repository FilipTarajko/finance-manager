<script setup lang="ts">
import { useAccountsStore } from '@/stores/accountsStore';
import TransactionEditDialog from "@/components/Transactions/TransactionEditDialog.vue"
import AccountComponent from "@/components/Accounts/AccountComponent.vue"
import { ref, type Ref } from 'vue';
import type { TransactionWithCategoryData } from '@/types/types';
const accountsStore = useAccountsStore();

let isTransactionDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

function showTransactionDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isTransactionDialogShown.value = true
}

function hideTransactionDialog() {
  isTransactionDialogShown.value = false
}
</script>

<template>
  <h1>Accounts</h1>
  <ul>
    <li
      v-for="account in accountsStore.accounts"
      :key="account.id"
    >
      <AccountComponent
        :account="account"
        :showTransactionDialog="showTransactionDialog"
      ></AccountComponent>
    </li>
  </ul>
  <TransactionEditDialog
    v-model=isTransactionDialogShown
    :hideDialog="hideTransactionDialog"
    :transaction="dialogTransaction"
></TransactionEditDialog></template>
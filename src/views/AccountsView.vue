<script setup lang="ts">
import { useAccountsStore } from '@/stores/accountsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import TransactionList from "@/components/Transactions/TransactionList.vue"
import TransactionEditDialog from "@/components/Transactions/TransactionEditDialog.vue"
import { ref, type Ref } from 'vue';
import type { TransactionWithCategoryData } from '@/types/types';
const accountsStore = useAccountsStore();
const categoriesStore = useCategoriesStore();

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
      {{ account }}
      <TransactionList
        :showDialog="showTransactionDialog"
        :transactions="categoriesStore.transactions.filter(elem => elem.account_id == account.id)"
      >
      </TransactionList>
    </li>
  </ul>
  <TransactionEditDialog
    v-model=isTransactionDialogShown
    :hideDialog="hideTransactionDialog"
    :transaction="dialogTransaction"
  ></TransactionEditDialog>
</template>
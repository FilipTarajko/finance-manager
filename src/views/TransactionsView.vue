<script setup lang="ts">
import { ref } from 'vue';
import TransactionForm from '@/components/Transactions/TransactionForm.vue';
import TransactionList from '@/components/Transactions/TransactionList.vue';
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useTransactionFormComposable } from '@/composables/transactionFormComposable';
import TransactionImportDialog from '@/components/Transactions/TransactionImportDialog.vue';

const categoriesStore = useCategoriesStore();

const { isTransactionDialogShown, dialogTransaction, showTransactionDialog } =
  useTransactionFormComposable();

const isTransactionImportDialogShown = ref(false);
const fileToImportTransactions = ref<any>(null);
</script>

<template>
  <main>
    <h1>Transactions</h1>
    <TransactionForm />
    <h2>transaction history</h2>
    <TransactionList
      :transactions="categoriesStore.transactions"
      @showTransactionDialog="showTransactionDialog"
    ></TransactionList>

    <div class="mt-12">
      File to import transactions:
      <v-file-input
        v-model="fileToImportTransactions"
        @change="isTransactionImportDialogShown = true"
        label="File input"
        accept=".csv"
      ></v-file-input>
    </div>

    <TransactionEditDialog
      v-model="isTransactionDialogShown"
      :transaction="dialogTransaction"
    ></TransactionEditDialog>
    <TransactionImportDialog
      v-model="isTransactionImportDialogShown"
      :fileToImportTransactions="fileToImportTransactions"
    ></TransactionImportDialog>
  </main>
</template>

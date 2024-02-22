<script setup lang="ts">
import { useCurrenciesStore } from '@/stores/currenciesStore';
const currenciesStore = useCurrenciesStore();
import { useAccountsStore } from '@/stores/accountsStore';
const accountsStore = useAccountsStore();
import { useCategoriesStore } from '@/stores/categoriesStore';
import type { Currency, TransactionWithCategoryData } from '@/types/types';
import { ref, type Ref } from 'vue';
import TransactionEditDialog from "@/components/Transactions/TransactionEditDialog.vue"
import TransactionList from "@/components/Transactions/TransactionList.vue"
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

function getAccountIdsByCurrency(currency: Currency) {
  return accountsStore.accounts.filter(acc => acc.currency_id == currency.id).map(e => e.id)
}

function getAccountNamesByCurrency(currency: Currency) {
  return accountsStore.accounts.filter(acc => acc.currency_id == currency.id).map(e => e.name)
}

</script>

<template>
  <h1>Currencies</h1>
  <ul>
    <li
      v-for="currency in currenciesStore.currencies"
      :key="currency.id"
    >
      {{ currency }}, accounts: {{ getAccountNamesByCurrency(currency).join(", ") }}
      <div
        v-if="currenciesStore.default_currency_id == currency.id"
        style="color: green;"
      >primary currency</div>
      <TransactionList
        :showDialog="showTransactionDialog"
        :transactions="categoriesStore.transactions.filter(elem => getAccountIdsByCurrency(currency).includes(elem.account_id))"
      >
      </TransactionList>
      balance:
      {{ categoriesStore.transactions.filter(elem =>
        getAccountIdsByCurrency(currency).includes(elem.account_id)).reduce((sum, e) => e.amount + sum, 0).toFixed(2) }}
      {{ currency.name }}
    </li>
  </ul>
  <TransactionEditDialog
    v-model=isTransactionDialogShown
    :hideDialog="hideTransactionDialog"
    :transaction="dialogTransaction"
  ></TransactionEditDialog>
</template>
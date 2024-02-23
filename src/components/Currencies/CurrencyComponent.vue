<script setup lang="ts">
import type { Category, TransactionWithCategoryData } from '@/types/types'
import { useCategoriesStore } from "@/stores/categoriesStore"
const categoriesStore = useCategoriesStore();
const accountsStore = useAccountsStore();
import TransactionList from "@/components/Transactions/TransactionList.vue"
import type { Currency } from '@/types/types';
import { useAccountsStore } from '@/stores/accountsStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
const currenciesStore = useCurrenciesStore();

defineProps<{
  currency: Currency,
  showTransactionDialog: Function
}>()

function getAccountIdsByCurrency(currency: Currency) {
  return accountsStore.accounts.filter(acc => acc.currency_id == currency.id).map(e => e.id)
}

function getAccountNamesByCurrency(currency: Currency) {
  return accountsStore.accounts.filter(acc => acc.currency_id == currency.id).map(e => e.name)
}

</script>


<template>
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
</template>
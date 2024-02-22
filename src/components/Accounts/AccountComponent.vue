<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import TransactionList from "@/components/Transactions/TransactionList.vue"
const categoriesStore = useCategoriesStore();
const currenciesStore = useCurrenciesStore();

defineProps<{
  account: any,
  showTransactionDialog: Function
}>()
</script>

<template>
  {{ account }}
  <TransactionList
    :showDialog="showTransactionDialog"
    :transactions="categoriesStore.transactions.filter(elem => elem.account_id == account.id)"
  >
  </TransactionList>
  balance:
  {{ categoriesStore.transactions.filter(elem => elem.account_id == account.id).reduce((sum, e) => e.amount + sum,
    0).toFixed(2)
  }}
  {{ currenciesStore.getCurrencyNameByAccount(account) }}
</template>
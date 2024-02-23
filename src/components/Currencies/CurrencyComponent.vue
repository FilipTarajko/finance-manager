<script setup lang="ts">
import { useCategoriesStore } from "@/stores/categoriesStore"
const categoriesStore = useCategoriesStore();
import TransactionList from "@/components/Transactions/TransactionList.vue"
import type { Currency } from '@/types/types';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import { computed } from "vue";
const currenciesStore = useCurrenciesStore();

const props = defineProps<{
  currency: Currency,
  showCurrencyDialog: Function,
  showTransactionDialog: Function
}>()

const accountIds = computed(() => {
  return currenciesStore.getAccountIdsByCurrency(props.currency)
})

const transactions = computed(() => {
  return categoriesStore.transactions
    .filter(elem => accountIds.value.includes(elem.account_id))
})

const balance = computed(() => {
  return transactions.value
    .reduce((sum, e) => e.amount + sum, 0).toFixed(2)
})
</script>


<template>
  {{ currency }}
  <v-icon
    @click="showCurrencyDialog(currency)"
    class="edit-button"
    icon="mdi-pencil"
    aria-label="edit currency"
    style="color: yellow"
  />
  <v-icon
    @click="currenciesStore.currencies.length != 1 && currenciesStore.deleteCurrency(currency)"
    icon="mdi-delete"
    aria-label="delete currency"
    :style="'color: ' + (currenciesStore.currencies.length != 1 ? 'red' : 'gray')"
    :disabled="currenciesStore.currencies.length == 1"
  />
  <br>Accounts: {{ currenciesStore.getAccountNamesByCurrency(currency).join(", ") || '-' }}
  <br>
  <div
    v-if="currenciesStore.default_currency_id == currency.id"
    style="color: green;"
  >primary currency</div>
  <TransactionList
    :showDialog="showTransactionDialog"
    :transactions="transactions"
  >
  </TransactionList>
  balance:
  {{ balance }}
  {{ currency.name }}
</template>
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
  {{ currency.name }}
  <!-- equal to {{ currency.value }}{{ currenciesStore.getDefaultCurrency().name }},  -->
  (based on {{ currenciesStore.getCurrencyById(currency.base_currency_id)!.name }}),
  value: {{ currency.value }}
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
  <v-btn
    v-if="currenciesStore.default_currency_id == currency.id"
    class="mb-1"
    style="color: green;"
    disabled
  >default currency</v-btn>
  <v-btn
    v-else
    class="mb-1"
    @click="currenciesStore.default_currency_id = currency.id"
  >
    set as default
  </v-btn>
  <br>
  <TransactionList
    :showDialog="showTransactionDialog"
    :transactions="transactions"
  >
  </TransactionList>
  balance:
  {{ balance }}
  {{ currency.name }}
</template>
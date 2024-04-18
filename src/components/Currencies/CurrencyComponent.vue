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
  <div class="mt-12 mb-1" style="font-size: 1.2rem; display: flex; flex-direction: row;">
    <div style="width: 92%;">
    {{ currency.name }}
    <template v-if="currency.api_name != ''">
      (api name: {{ currency.api_name }})
    </template>
    <template v-if="currency.id != currenciesStore.default_currency_id">
      <template v-if="currency.base_currency_id != currenciesStore.default_currency_id">
        (equal to {{ currency.value_relative_to_default }}{{ currenciesStore.getDefaultCurrency().name }},
      </template>
      <template v-else>(</template>

      <template v-if="!currency.api_name || !currenciesStore.getCurrencyById(currency.base_currency_id)?.api_name">defined as {{
      currency.value_relative_to_base }}{{ currenciesStore.getCurrencyById(currency.base_currency_id)!.name}})
      </template>
      <template v-else>updated with api, today: {{ currency.value_relative_to_base }}{{
      currenciesStore.getCurrencyById(currency.base_currency_id)!.name}})
      </template>
    </template>
    </div>
    <div style="width: 8%; text-align: right;">
      <v-icon
        @click="showCurrencyDialog(currency)"
        class="edit-button"
        icon="mdi-pencil"
        aria-label="edit currency"
        style="color: var(--visible-yellow)"
      />
      <v-icon
        @click="currenciesStore.currencies.length != 1 && currenciesStore.deleteCurrency(currency)"
        icon="mdi-delete"
        aria-label="delete currency"
        :style="'color: ' + (currenciesStore.currencies.length != 1 ? 'red' : 'gray')"
        :disabled="currenciesStore.currencies.length == 1"
      />
    </div>
  </div>
  balance:
  {{ balance }}
  {{ currency.name }}
  <br>
  Accounts: {{ currenciesStore.getAccountNamesByCurrency(currency).join(", ") || '-' }}
  <br>
  <!-- <v-btn
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
  <br> -->
  <TransactionList
    :showDialog="showTransactionDialog"
    :transactions="transactions"
  >
  </TransactionList>
</template>
<script setup lang="ts">
import { useCurrenciesStore } from '@/stores/currenciesStore';
const currenciesStore = useCurrenciesStore();
import type { Currency } from '@/types/types';
import { ref, type Ref } from 'vue';
import TransactionEditDialog from "@/components/Transactions/TransactionEditDialog.vue"
import CurrencyComponent from "@/components/Currencies/CurrencyComponent.vue"
import CurrencyEditDialog from "@/components/Currencies/CurrencyEditDialog.vue"
import CurrencyForm from "@/components/Currencies/CurrencyForm.vue"

const isCurrencyDialogShown = ref(false)
const dialogCurrency: Ref<Currency | null> = ref(null)
const isRatesApiUpdateInProgress = ref(false)

function showCurrencyDialog(currency: Currency) {
  dialogCurrency.value = currency
  isCurrencyDialogShown.value = true
}

async function updateRates() {
  isRatesApiUpdateInProgress.value = true
  await currenciesStore.updateValuesWithApi()
  isRatesApiUpdateInProgress.value = false
}

import { useTransactionFormComposable } from "@/composables/transactionFormComposable";
const { isTransactionDialogShown, dialogTransaction, showTransactionDialog } = useTransactionFormComposable();
</script>

<template>
  <h1>Currencies</h1>
  <CurrencyForm></CurrencyForm>
  <ul>
    <li
      v-for="currency in currenciesStore.currencies"
      :key="currency.id"
    >
      <CurrencyComponent
        :currency="currency"
        :showCurrencyDialog="showCurrencyDialog"
        :showTransactionDialog="showTransactionDialog"
      ></CurrencyComponent>
    </li>
  </ul>
  <CurrencyEditDialog
    v-model=isCurrencyDialogShown
    :editedCurrency="dialogCurrency"
  ></CurrencyEditDialog>
  <TransactionEditDialog
    v-model=isTransactionDialogShown
    :transaction="dialogTransaction"
  ></TransactionEditDialog>

  <v-btn
    :loading="isRatesApiUpdateInProgress"
    :disabled="isRatesApiUpdateInProgress"
    class="mt-16"
    color="info"
    @click="updateRates">
    update currency values with api
  </v-btn>

  <div class="mt-2 border-solid pa-2">
    api supports: {{ currenciesStore.currenciesSupportedByApi }}
    <hr class="mt-2 mb-2">
    used api: <a href="https://www.vatcomply.com/">VATcomply</a>
    <hr class="mt-2 mb-2">
    new api data on workdays, 16:00 CET
  </div>
</template>
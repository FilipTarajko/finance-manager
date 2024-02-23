<script setup lang="ts">
import { useCurrenciesStore } from '@/stores/currenciesStore';
const currenciesStore = useCurrenciesStore();
import type { Currency, TransactionWithCategoryData } from '@/types/types';
import { ref, type Ref } from 'vue';
import TransactionEditDialog from "@/components/Transactions/TransactionEditDialog.vue"
import CurrencyComponent from "@/components/Currencies/CurrencyComponent.vue"
import CurrencyEditDialog from "@/components/Currencies/CurrencyEditDialog.vue"
import CurrencyForm from "@/components/Currencies/CurrencyForm.vue"

let isCurrencyDialogShown = ref(false)
let dialogCurrency: Ref<Currency | null> = ref(null)
function showCurrencyDialog(currency: Currency) {
  dialogCurrency.value = currency
  isCurrencyDialogShown.value = true
}


let isTransactionDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)
function showTransactionDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isTransactionDialogShown.value = true
}


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
</template>
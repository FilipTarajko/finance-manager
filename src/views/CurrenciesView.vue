<script setup lang="ts">
import { useCurrenciesStore } from '@/stores/currenciesStore';
const currenciesStore = useCurrenciesStore();
import type { TransactionWithCategoryData } from '@/types/types';
import { ref, type Ref } from 'vue';
import TransactionEditDialog from "@/components/Transactions/TransactionEditDialog.vue"
import CurrencyComponent from "@/components/Currencies/CurrencyComponent.vue"
import CurrencyForm from "@/components/Currencies/CurrencyForm.vue"

function showTransactionDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isTransactionDialogShown.value = true
}

let isTransactionDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

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
        :showTransactionDialog="showTransactionDialog"
      ></CurrencyComponent>
    </li>
  </ul>
  <TransactionEditDialog
    v-model=isTransactionDialogShown
    :transaction="dialogTransaction"
  ></TransactionEditDialog>
</template>
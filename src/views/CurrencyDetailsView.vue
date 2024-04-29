<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import CurrencyComponent from '@/components/Currencies/CurrencyComponent.vue'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import CurrencyEditDialog from '@/components/Currencies/CurrencyEditDialog.vue'
import type { Currency } from '@/types/types'
import { useTransactionFormComposable } from '@/composables/transactionFormComposable'
import { useCurrenciesStore } from '@/stores/currenciesStore'
const currenciesStore = useCurrenciesStore()
const route = useRoute()

const currency = computed(() => {
  return currenciesStore.getCurrencyById(route.params.currencyId as any)
})

const { isTransactionDialogShown, dialogTransaction, showTransactionDialog } =
  useTransactionFormComposable()

const isCurrencyDialogShown = ref(false)
const dialogCurrency: Ref<Currency | null> = ref(null)

function showCurrencyDialog(currency: Currency) {
  dialogCurrency.value = currency
  isCurrencyDialogShown.value = true
}
</script>

<template>
  <main>
    <h1>Currency</h1>
    <template v-if="currency">
      <CurrencyComponent
        :currency="currency"
        @showCurrencyDialog="showCurrencyDialog"
        :showTransactionDialog="showTransactionDialog"
      ></CurrencyComponent>
      <CurrencyEditDialog
        v-model="isCurrencyDialogShown"
        :editedCurrency="dialogCurrency"
      ></CurrencyEditDialog>
      <TransactionEditDialog
        v-model="isTransactionDialogShown"
        :transaction="dialogTransaction"
      ></TransactionEditDialog>
    </template>
    <template v-else> Currency not found </template>
  </main>
</template>

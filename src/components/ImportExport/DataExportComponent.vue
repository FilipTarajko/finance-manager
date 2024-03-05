<script setup lang="ts">
import { useAccountsStore } from '@/stores/accountsStore';
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useCurrenciesStore } from '@/stores/currenciesStore'
const categoriesStore = useCategoriesStore()
const accountsStore = useAccountsStore()
const currenciesStore = useCurrenciesStore()

function getLocale() {
  if (navigator.languages != undefined) {
    return navigator.languages[0]
  }
  return navigator.language
}

function exportData() {
  const dataToExport = {
    categories: categoriesStore.categories,
    default_account_id: accountsStore.default_account_id,
    default_currency_id: currenciesStore.default_currency_id,
    accounts: accountsStore.accounts,
    currencies: currenciesStore.currencies
  }
  const text = JSON.stringify(dataToExport)
  const filename = 'exported data ' + new Date().toLocaleString(getLocale()) + '.json'

  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
</script>

<template>
  <v-card class="pa-4 mb-12">
    <h2>Export to file</h2>
    <v-btn
      class="mb-4 mt-4"
      @click="exportData"
      variant="outlined"
    > export data </v-btn>
  </v-card>
</template>
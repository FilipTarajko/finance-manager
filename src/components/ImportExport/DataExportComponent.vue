<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { useAccountsStore } from '@/stores/accountsStore';
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useCurrenciesStore } from '@/stores/currenciesStore'
const categoriesStore = useCategoriesStore()
const accountsStore = useAccountsStore()
const currenciesStore = useCurrenciesStore()

const isDataBeingProcessed: Ref<boolean | undefined> = defineModel()
const isExportingToFile: Ref<boolean> = ref(false)
  
import { useSnackbarStore } from '@/stores/snackbarStore';
const snackbarStore = useSnackbarStore()

function getLocale() {
  if (navigator.languages != undefined) {
    return navigator.languages[0]
  }
  return navigator.language
}

function exportData() {
  isDataBeingProcessed.value = true
  isExportingToFile.value = true
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
  snackbarStore.showSnackbarMessage('green', "File is being downloaded")
  document.body.removeChild(element)
  isDataBeingProcessed.value = false
  isExportingToFile.value = false
}
</script>

<template>
  <v-card class="pa-4 mb-12">
    <h2>Export to file</h2>
    <v-btn
      class="mb-4 mt-4"
      @click="exportData"
      :disabled="isDataBeingProcessed"
      :loading="isExportingToFile"
      variant="outlined"
    > export data </v-btn>
  </v-card>
</template>
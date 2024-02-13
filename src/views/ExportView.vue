<script setup lang="ts">
import { useTransactionsStore } from '@/stores/transactionsStore'
const transactionsStore = useTransactionsStore()

function getLocale() {
  if (navigator.languages != undefined) {
    return navigator.languages[0]
  }
  return navigator.language
}

function exportData() {
  let text = JSON.stringify(transactionsStore.transactions)
  let filename = 'exported data ' + new Date().toLocaleString(getLocale()) + '.txt'

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
  <h1 class="mb-4">Export</h1>
  <v-btn @click="exportData" theme="dark" variant="outlined"> export data </v-btn>
</template>

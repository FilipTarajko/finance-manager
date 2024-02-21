<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

function getLocale() {
  if (navigator.languages != undefined) {
    return navigator.languages[0]
  }
  return navigator.language
}

function exportData() {
  let text = JSON.stringify(categoriesStore.categories)
  let filename = 'exported data ' + new Date().toLocaleString(getLocale()) + '.json'

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
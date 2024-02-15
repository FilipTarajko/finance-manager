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
  <h1 class="mb-4">Export</h1>
  <v-btn
    @click="exportData"
    variant="outlined"
  > export data </v-btn></template>

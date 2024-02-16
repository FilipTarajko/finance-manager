<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
import type { Category } from '@/types/types';
import { ref } from 'vue';
const categoriesStore = useCategoriesStore()

const textFieldData = ref("")

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

function isCategory(obj: unknown): obj is Category {
  return (
    (obj || false) &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'color' in obj &&
    typeof obj.color === 'string' &&
    'icon' in obj &&
    typeof obj.icon === 'string' &&
    'transactions' in obj &&
    Array.isArray(obj.transactions) &&
    obj.transactions.every(transaction =>
      transaction &&
      typeof transaction === 'object' &&
      'id' in transaction &&
      typeof transaction.id === 'number' &&
      'name' in transaction &&
      typeof transaction.name === 'string' &&
      'amount' in transaction &&
      typeof transaction.amount === 'number' &&
      'timestamp' in transaction &&
      typeof transaction.timestamp === 'number'
    )
  );
}

function tryParseTextIntoCategories(stringToImport: string): { errorMessage: string } | { data: Category[] } {
  try {
    let parsedData = JSON.parse(stringToImport)
    if (!Array.isArray(parsedData)) {
      return { errorMessage: "not an array" };
    }
    for (let i = 0; i < parsedData.length; i++) {
      if (!isCategory(parsedData[i])) {
        return { errorMessage: `${JSON.stringify(parsedData[i])} is not a valid category` };
      }
    }
    return { data: parsedData };
  } catch {
    return { errorMessage: "not a json" };
  }
}

function tryImportData(stringToImport: string) {
  console.time("tryImportData")
  const result = tryParseTextIntoCategories(stringToImport)
  if ("data" in result) {
    categoriesStore.categories = result.data;
    console.log("IMPORTED")
  } else {
    console.error(result?.errorMessage || "unknown error")
  }
  console.timeEnd("tryImportData")
}
</script>

<template>
  <h1 class="mb-4">Export</h1>
  <v-btn
    class="mb-4"
    @click="exportData"
    variant="outlined"
  > export data </v-btn>
  <!-- <br>
  <v-btn
    class="mb-4"
    @click="tryImportData('[]')"
    variant="outlined"
  > import data from file </v-btn> -->
  <v-textarea v-model="textFieldData">
  </v-textarea>
  <v-btn
    class="mb-4"
    @click="tryImportData(textFieldData)"
    variant="outlined"
  > import data from text </v-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCategoriesStore } from '@/stores/categoriesStore'
import type { Category } from '@/types/types';
const categoriesStore = useCategoriesStore()
let fileData = ref([])
let showJsonOnly = ref(true)
const textFieldData = ref("")

function tryImportFromFile() {
  const file = fileData.value[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = (e?.target?.result);
    if (data as string) {
      tryImportData(data as string);
    }
  };
  reader.readAsText(file);
}

function tryImportData(stringToImport: string) {
  console.time("tryImportData")
  const result = tryParseTextIntoCategories(stringToImport)
  if ("data" in result) {
    categoriesStore.categories = result.data;
    console.log(`imported data with ${result.data.length} categories`)
  } else {
    console.error(result?.errorMessage || "unknown error")
  }
  console.timeEnd("tryImportData")
}
</script>

<script lang="ts">
export function isCategory(obj: unknown): obj is Category {
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

export function tryParseTextIntoCategories(stringToImport: string): { errorMessage: string } | { data: Category[] } {
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
</script>

<template>
  <v-card class="pa-4 mb-12">
    <h2>Import from file</h2>
    <v-switch
      v-model="showJsonOnly"
      class="mt-2"
      inset
      label="Only show .json files"
    >
    </v-switch>
    <v-file-input
      v-model="fileData"
      :accept="showJsonOnly ? 'application/json' : ''"
      label="File input"
    ></v-file-input>
    <v-btn
      class="mb-4"
      :disabled="!fileData.length"
      @click="tryImportFromFile()"
      variant="outlined"
    > import from file</v-btn>
  </v-card>
  <v-card class="pa-4">
    <h2>Import from text</h2>
    <v-textarea
      class="mt-4"
      v-model="textFieldData"
    >
    </v-textarea>
    <v-btn
      class="mb-4"
      :disabled="!textFieldData"
      @click="tryImportData(textFieldData)"
      variant="outlined"
    > import from text </v-btn>
  </v-card>
</template>
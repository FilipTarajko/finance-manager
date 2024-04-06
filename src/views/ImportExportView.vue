<script setup lang="ts">
import Export from "@/components/ImportExport/DataExportComponent.vue"
import Import from "@/components/ImportExport/DataImportComponent.vue"
import { type Ref, ref } from "vue"

const isDataBeingProcessed: Ref<boolean> = ref(false)
</script>

<template>
  <main>
    <h1 class="mb-4">Export or import data</h1>
    <Export v-model=isDataBeingProcessed></Export>
    <Import v-model=isDataBeingProcessed></Import>
  </main>
</template>

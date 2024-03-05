<script setup lang="ts">
import Export from "@/components/ImportExport/DataExportComponent.vue"
import Import from "@/components/ImportExport/DataImportComponent.vue"
import { type Ref, ref } from "vue"

const isDataBeingProcessed: Ref<boolean> = ref(false)
const snackbarText = ref('snackbar text')
const isSnackbarDisplayed = ref(false)
const snackbarColor = ref("red")

function showSnackbarMessage(color: string, text: string) {
  snackbarColor.value = color
  snackbarText.value = text
  isSnackbarDisplayed.value = true
}
</script>

<template>
  <h1 class="mb-4">Export or import data</h1>
  <Export v-model=isDataBeingProcessed @snackbar="showSnackbarMessage"></Export>
  <Import v-model=isDataBeingProcessed @snackbar="showSnackbarMessage"></Import>
  <div class="text-center ma-2">
    <v-snackbar
      :color=snackbarColor
      v-model="isSnackbarDisplayed"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="isSnackbarDisplayed = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

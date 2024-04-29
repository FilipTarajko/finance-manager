<script setup lang="ts">
import CurrencyForm from '@/components/Currencies/CurrencyForm.vue'
import type { Currency } from '@/types/types'
import type { Ref } from 'vue'

const isDialogShown: Ref<boolean | undefined> = defineModel()

defineProps<{
  editedCurrency: Currency | null
}>()
</script>

<template>
  <v-dialog width="auto" v-model="isDialogShown">
    <v-card>
      <v-card-text>
        <CurrencyForm
          :currency="editedCurrency"
          @hideDialog="
            () => {
              isDialogShown = false
            }
          "
        >
        </CurrencyForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

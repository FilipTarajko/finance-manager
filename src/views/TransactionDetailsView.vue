<script setup lang="ts">
import { useCategoriesStore } from '../stores/categoriesStore'
import TransactionForm from '@/components/TransactionForm.vue'
import Transaction from '@/components/Transaction.vue'
import type { TransactionWithCategoryData } from '@/types/types';
import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
const categoriesStore = useCategoriesStore()
const route = useRoute()

let isDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

function showDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isDialogShown.value = true
}

function hideDialog() {
  isDialogShown.value = false
}

const transaction = computed(() => {
  return categoriesStore.transactions.find((e) => e.id == (route.params.transactionId as any))
})
</script>

<template>
  <main>
    <h1>Transaction</h1>
    <template v-if="transaction">
      <Transaction
        :item=transaction
        :showDialog=showDialog
      ></Transaction>
      <v-dialog
        width="auto"
        v-model="isDialogShown"
      >
        <v-card>
          <v-card-text>
            <TransactionForm
              :transaction="transaction"
              :hideDialog="hideDialog"
            >
            </TransactionForm>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

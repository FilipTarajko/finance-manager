<script setup lang="ts">
import TransactionForm from '@/components/TransactionForm.vue'
import Transaction from '@/components/Transaction.vue'
import { ref, type Ref } from 'vue'
import type { TransactionWithCategoryData } from '@/types/types'
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

let isDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

function showDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isDialogShown.value = true
}

function hideDialog() {
  isDialogShown.value = false
}
</script>

<template>
  <main>
    <h1>Transactions</h1>
    <TransactionForm />
    <h2>transaction history</h2>
    <v-card
      theme="dark"
      width="500"
    >
      <v-virtual-scroll
        :height="300"
        :items="categoriesStore.transactions"
      >
        <template v-slot:default="{ item }">
          <Transaction
            :item=item
            :showDialog=showDialog
          ></Transaction>
        </template>
      </v-virtual-scroll>
    </v-card>
    <v-dialog
      width="auto"
      v-model="isDialogShown"
    >
      <v-card>
        <v-card-text>
          <TransactionForm
            :transaction="dialogTransaction"
            :hideDialog="hideDialog"
          >
          </TransactionForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </main>
</template>

<script setup lang="ts">
import TransactionForm from '@/components/TransactionForm.vue'
import { useTransactionsStore } from '../stores/transactionsStore'
import { ref, type Ref } from 'vue'
import type { Transaction } from '@/types/types'
const transactionsStore = useTransactionsStore()

let isDialogShown = ref(false)
let dialogTransaction: Ref<Transaction | null> = ref(null)

function showDialog(transaction: Transaction) {
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
    <ul>
      <li v-for="transaction of transactionsStore.transactions" :key="transaction.id">
        {{ transaction.id }} -

        <RouterLink :to="'/transactions/' + transaction.id">
          {{ transaction.name }}
        </RouterLink>
        : {{ transaction.amount }} (
        <span :style="{ color: transaction.category.color }">
          <v-icon :icon="transaction.category.icon" />{{ transaction.category.name }} </span
        >)
        <v-icon
          @click="showDialog(transaction)"
          class="edit-button"
          icon="mdi-pencil"
          style="color: yellow"
        />
        <v-icon
          icon="mdi-delete"
          class="remove-button"
          style="color: red"
          @click="transactionsStore.deleteTransaction(transaction)"
        ></v-icon>
      </li>
    </ul>
    <v-dialog width="auto" v-model="isDialogShown">
      <v-card>
        <v-card-text>
          <TransactionForm :transaction="dialogTransaction" :hideDialog="hideDialog">
          </TransactionForm>
        </v-card-text>
      </v-card>
    </v-dialog>
  </main>
</template>

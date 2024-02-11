<script setup lang="ts">
import NewTransactionForm from '@/components/NewTransactionForm.vue'
import { useTransactionStore } from '../stores/transactionStore'
const transactionsStore = useTransactionStore()
</script>

<template>
  <main>
    <h1>Transactions</h1>
    <NewTransactionForm />
    <h2>transaction history</h2>
    <ul>
      <li v-for="transaction of transactionsStore.transactions" :key="transaction.id">
        {{ transaction.id }} - {{ transaction.name }}: {{ transaction.amount }}
      </li>
    </ul>
  </main>
</template>

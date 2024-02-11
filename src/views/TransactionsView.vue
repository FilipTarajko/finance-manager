<script setup lang="ts">
import NewTransactionForm from '@/components/NewTransactionForm.vue'
import { useTransactionsStore } from '../stores/transactionsStore'
const transactionsStore = useTransactionsStore()
</script>

<template>
  <main>
    <h1>Transactions</h1>
    <NewTransactionForm />
    <h2>transaction history</h2>
    <ul>
      <li v-for="transaction of transactionsStore.transactions" :key="transaction.id">
        {{ transaction.id }} - {{ transaction.name }}: {{ transaction.amount }} (
        <span :style="{ color: transaction.category.color }">

          <v-icon :icon="transaction.category.icon" />{{
            transaction.category.name
          }}
        </span>)
      </li>
    </ul>
  </main>
</template>

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
        {{ transaction.id }} -

        <RouterLink :to="'/transactions/' + transaction.id">
          {{ transaction.name }}
        </RouterLink>
        : {{ transaction.amount }} (
        <span :style="{ color: transaction.category.color }">
          <v-icon :icon="transaction.category.icon" />{{ transaction.category.name }} </span
        >)
        <v-icon
          icon="mdi-delete"
          style="color: red"
          @click="transactionsStore.deleteTransaction(transaction)"
        ></v-icon>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { useTransactionsStore } from '../stores/transactionsStore'
const transactionsStore = useTransactionsStore()
</script>

<template>
  <h1>Statistics</h1>
  positive transactions: {{ transactionsStore.positiveTransactions.length }}
  <br />
  total gains:
  {{ transactionsStore.positiveTransactions.reduce((sum, elem) => sum + elem.amount, 0) }}
  <br />
  negative transactions: {{ transactionsStore.negativeTransactions.length }}
  <br />
  total losses:
  {{ transactionsStore.negativeTransactions.reduce((sum, elem) => sum - elem.amount, 0) }}
  <br />
  total difference: {{ transactionsStore.transactions.reduce((sum, elem) => sum + elem.amount, 0) }}
</template>

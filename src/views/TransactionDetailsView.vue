<script setup lang="ts">
import { useTransactionsStore } from '../stores/transactionsStore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const transactionsStore = useTransactionsStore()
const route = useRoute()

const transaction = computed(() => {
  return transactionsStore.transactions.filter(
    (e) => e.id == (route.params.transactionId as any)
  )[0]
})
</script>

<template>
  <main>
    <h1>Transaction</h1>
    <template v-if="transaction">
      {{ transaction.id }} - {{ transaction.name }}: {{ transaction.amount }} ({{
        transaction.category.name
      }})
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

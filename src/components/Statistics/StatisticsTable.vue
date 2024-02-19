<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
import { computed } from 'vue'
const categoriesStore = useCategoriesStore()

const props = defineProps<{
  minTimestamp: number,
  maxTimestamp: number
}>();

const positiveTransactionsInstances = computed(() => {
  return categoriesStore.positiveTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .length
})
const positiveTransactionsGains = computed(() => {
  return categoriesStore.positiveTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .reduce((sum, elem) => sum + elem.amount, 0)
})
const negativeTransactionsInstances = computed(() => {
  return categoriesStore.negativeTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .length
})
const negativeTransactionsLosses = computed(() => {
  return categoriesStore.negativeTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .reduce((sum, elem) => sum + elem.amount, 0)
})
const totalTransactionsInstances = computed(() => {
  return negativeTransactionsInstances.value + positiveTransactionsInstances.value
})
const totalTransactionsSum = computed(() => {
  return negativeTransactionsLosses.value + positiveTransactionsGains.value
})

</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">type of transaction</th>
        <th class="text-left">number of transactions</th>
        <th class="text-left">money gained</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>positive</td>
        <td>{{ positiveTransactionsInstances }}</td>
        <td>{{ positiveTransactionsGains.toFixed(2) }}</td>
      </tr>
      <tr>
        <td>negative</td>
        <td>{{ negativeTransactionsInstances }}</td>
        <td>{{ negativeTransactionsLosses.toFixed(2) }}</td>
      </tr>
      <tr>
        <td>total</td>
        <td>{{ totalTransactionsInstances }}</td>
        <td>{{ totalTransactionsSum.toFixed(2) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useCurrenciesStore } from '@/stores/currenciesStore'
import { computed } from 'vue'
const categoriesStore = useCategoriesStore()
const currenciesStore = useCurrenciesStore()

const props = defineProps<{
  minTimestamp: number,
  maxTimestamp: number,
  currency_id: number | null
}>();

const positiveTransactionsInstances = computed(() => {
  return categoriesStore.positiveTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .filter(transaction => props.currency_id == null || currenciesStore.getCurrencyByTransaction(transaction)?.id == props.currency_id)
    .length
})
const positiveTransactionsGains = computed(() => {
  return categoriesStore.positiveTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .filter(transaction => props.currency_id == null || currenciesStore.getCurrencyByTransaction(transaction)?.id == props.currency_id)
    .reduce((sum, elem) => sum + elem.amount, 0)
})
const negativeTransactionsInstances = computed(() => {
  return categoriesStore.negativeTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .filter(transaction => props.currency_id == null || currenciesStore.getCurrencyByTransaction(transaction)?.id == props.currency_id)
    .length
})
const negativeTransactionsLosses = computed(() => {
  return categoriesStore.negativeTransactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .filter(transaction => props.currency_id == null || currenciesStore.getCurrencyByTransaction(transaction)?.id == props.currency_id)
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
  <h2>statistics summary</h2>
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
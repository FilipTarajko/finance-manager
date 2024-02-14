<script setup lang="ts">
import { useCategoriesStore } from '../stores/categoriesStore'
import PieChart from '../components/PieChart.vue'
import BarChart from '../components/BarChart.vue'
import { computed } from 'vue'
const categoriesStore = useCategoriesStore()

const positiveTransactionsInstances = computed(() => {
  return categoriesStore.positiveTransactions.length
})
const positiveTransactionsGains = computed(() => {
  return categoriesStore.positiveTransactions.reduce((sum, elem) => sum + elem.amount, 0)
})
const negativeTransactionsInstances = computed(() => {
  return categoriesStore.negativeTransactions.length
})
const negativeTransactionsLosses = computed(() => {
  return categoriesStore.negativeTransactions.reduce((sum, elem) => sum + elem.amount, 0)
})
const totalTransactionsInstances = computed(() => {
  return negativeTransactionsInstances.value + positiveTransactionsInstances.value
})
const totalTransactionsSum = computed(() => {
  return negativeTransactionsLosses.value + positiveTransactionsGains.value
})

function preparePieGraphInput(array: []) {
  return array.sort((a: any, b: any) => b.value - a.value)
}

const transactionInstancesByCategory = computed(() => {
  let array: any = []
  categoriesStore.categories.forEach((category) => {
    let value = category.transactions.length
    category.transactions.length &&
      array.push({ name: category.name, value, color: category.color })
  })
  return preparePieGraphInput(array)
})

const transactionGainsByCategory = computed(() => {
  let array: any = []
  categoriesStore.categories.forEach((category) => {
    let value = category.transactions
      .filter((e) => e.amount > 0)
      .reduce((sum, elem) => sum + elem.amount, 0)
    value = Math.round(value * 100) / 100
    value && array.push({ name: category.name, value, color: category.color })
  })
  return preparePieGraphInput(array)
})

const transactionLossesByCategory = computed(() => {
  let array: any = []
  categoriesStore.categories.forEach((category) => {
    let value = category.transactions
      .filter((e) => e.amount < 0)
      .reduce((sum, elem) => sum - elem.amount, 0)
    value = Math.round(value * 100) / 100
    value && array.push({ name: category.name, value, color: category.color })
  })
  return preparePieGraphInput(array)
})

const transactionsChronologicallyForBarChart = computed(() => {
  let array: any = []
  categoriesStore.transactions.forEach((elem) => {
    array.push({
      name: elem.name,
      value: elem.amount,
      itemStyle: {
        color: elem.categoryData.color
      }
    })
    // @ts-ignore
    array.sort((a, b) => b.timestamp - a.timestamp)
  })
  return array
})
</script>

<template>
  <h1>Statistics</h1>
  <v-table theme="dark">
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
  <PieChart class="chart" name="transactions by category" :input="transactionInstancesByCategory" />
  <PieChart class="chart" name="gains by category" :input="transactionGainsByCategory" />
  <PieChart class="chart" name="losses by category" :input="transactionLossesByCategory" />
  <BarChart
    class="chart--tall"
    name="transaction history"
    subtitle="with zoom"
    :input="transactionsChronologicallyForBarChart"
  />
</template>

<style lang="scss">
.chart {
  margin-top: 20px;
  height: 270px;

  &--tall {
    margin-top: 20px;
    height: 560px;
  }
}
</style>

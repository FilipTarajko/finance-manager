<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
import PieChart from '@/components/Statistics/PieChart.vue'
import BarChart from '@/components/Statistics/BarChart.vue'
import { computed } from 'vue'
const categoriesStore = useCategoriesStore()

const props = defineProps<{
  minTimestamp: number,
  maxTimestamp: number
}>();

function preparePieGraphInput(array: []) {
  return array.sort((a: any, b: any) => b.value - a.value)
}

const numberOfTransactionsInTimestampRange = computed(() => {
  return categoriesStore.transactions
    .filter(transaction => transaction.timestamp <= props.maxTimestamp)
    .filter(transaction => transaction.timestamp >= props.minTimestamp)
    .length
})

const transactionInstancesByCategory = computed(() => {
  let array: any = []
  categoriesStore.categories.forEach((category) => {
    let value = category.transactions
      .filter(transaction => transaction.timestamp <= props.maxTimestamp)
      .filter(transaction => transaction.timestamp >= props.minTimestamp)
      .length
    value && array.push({ name: category.name, value, color: category.color })
  })
  return preparePieGraphInput(array)
})

const transactionGainsByCategory = computed(() => {
  let array: any = []
  categoriesStore.categories.forEach((category) => {
    let value = category.transactions
      .filter((e) => e.amount > 0)
      .filter(transaction => transaction.timestamp <= props.maxTimestamp)
      .filter(transaction => transaction.timestamp >= props.minTimestamp)
      .reduce((sum, elem) => sum + elem.amount, 0)
      .toFixed(2)
    value != "0.00" && array.push({ name: category.name, value, color: category.color })
  })
  return preparePieGraphInput(array)
})

const transactionLossesByCategory = computed(() => {
  let array: any = []
  categoriesStore.categories.forEach((category) => {
    let value = category.transactions
      .filter((e) => e.amount < 0)
      .filter(transaction => transaction.timestamp <= props.maxTimestamp)
      .filter(transaction => transaction.timestamp >= props.minTimestamp)
      .reduce((sum, elem) => sum - elem.amount, 0)
      .toFixed(2)
    value != "0.00" && array.push({ name: category.name, value, color: category.color })
  })
  return preparePieGraphInput(array)
})

const transactionsChronologicallyForBarChart = computed(() => {
  let array: any = []
  for (let i = 0; i < categoriesStore.transactions.length; i++) {
    let elem = categoriesStore.transactions[i];
    if (elem.timestamp < props.minTimestamp || elem.timestamp > props.maxTimestamp) {
      continue;
    }
    array.push({
      name: elem.name,
      value: elem.amount.toFixed(2),
      itemStyle: {
        color: elem.categoryData.color
      }
    })
    // @ts-ignore
    array.sort((a, b) => b.timestamp - a.timestamp)
  }
  return array
})
</script>


<template>
  <h2>charts</h2>
  <template v-if="categoriesStore.transactions.length">
    <PieChart
      :key="numberOfTransactionsInTimestampRange"
      class="chart"
      name="transactions by category"
      :input="transactionInstancesByCategory"
    />
    <PieChart
      :key="numberOfTransactionsInTimestampRange"
      class="chart"
      name="gains by category"
      :input="transactionGainsByCategory"
    />
    <PieChart
      :key="numberOfTransactionsInTimestampRange"
      class="chart"
      name="losses by category"
      :input="transactionLossesByCategory"
    />
    <BarChart
      :key="numberOfTransactionsInTimestampRange"
      class="chart chart--tall chart--last"
      name="transaction history"
      subtitle="with zoom"
      :input="transactionsChronologicallyForBarChart"
    />
  </template>
  <template v-else>

    There are no
    <RouterLink :to="{ name: 'transactions' }">transactions</RouterLink>, so no charts can be shown.
  </template>
</template>

<style lang="scss">
.chart {
  margin-bottom: 20px;
  height: 270px;

  &--tall {
    height: 560px;
  }

  &--last {
    margin-bottom: 0px;
  }
}
</style>
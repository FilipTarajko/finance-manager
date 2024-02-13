<script setup lang="ts">
import { useTransactionsStore } from '../stores/transactionsStore'
import { useCategoriesStore } from '../stores/categoriesStore'
import PieChart from '../components/PieChart.vue'
import BarChart from '../components/BarChart.vue'
import { computed } from 'vue'
const transactionsStore = useTransactionsStore()
const categoriesStore = useCategoriesStore()

const positiveTransactionsInstances = computed(() => {
  return transactionsStore.positiveTransactions.length
})
const positiveTransactionsGain = computed(() => {
  return transactionsStore.positiveTransactions.reduce((sum, elem) => sum + elem.amount, 0)
})
const negativeTransactionsInstances = computed(() => {
  return transactionsStore.negativeTransactions.length
})
const negativeTransactionsLosses = computed(() => {
  return transactionsStore.negativeTransactions.reduce((sum, elem) => sum + elem.amount, 0)
})
const totalTransactionsInstances = computed(() => {
  return transactionsStore.transactions.length
})
const totalTransactionsSum = computed(() => {
  return transactionsStore.transactions.reduce((sum, elem) => sum + elem.amount, 0)
})

function objectToPieGraphInput(object: {}) {
  let array: any = []
  for (const [name, value] of Object.entries(object)) {
    array.push({ name, value })
  }
  array.sort((a: any, b: any) => b.value - a.value)
  categoriesStore.categories.forEach((category) => {
    array.forEach((arrayElem: any) => {
      if (category.name == arrayElem.name) {
        arrayElem.color = category.color
      }
    })
  })
  return array
}

const transactionInstancesByCategory = computed(() => {
  let object: any = {}
  transactionsStore.transactions.forEach((elem) => {
    if (elem.category.name in object) {
      object[elem.category.name] += 1
    } else {
      object[elem.category.name] = 1
    }
  })
  return objectToPieGraphInput(object)
})

const transactionGainsByCategory = computed(() => {
  let object: any = {}
  transactionsStore.positiveTransactions.forEach((elem) => {
    if (elem.category.name in object) {
      object[elem.category.name] += elem.amount
    } else {
      object[elem.category.name] = elem.amount
    }
  })
  return objectToPieGraphInput(object)
})

const transactionLossesByCategory = computed(() => {
  let object: any = {}
  transactionsStore.negativeTransactions.forEach((elem) => {
    if (elem.category.name in object) {
      object[elem.category.name] -= elem.amount
    } else {
      object[elem.category.name] = -elem.amount
    }
  })
  return objectToPieGraphInput(object)
})

const transactionsChronologically = computed(() => {
  let array: any = []
  transactionsStore.transactions.forEach((elem) => {
    array.push({
      name: elem.name,
      value: elem.amount,
      itemStyle: {
        color: elem.category.color
      }
    })
    array.sort((a, b) => b.timestamp - a.timestamp)
  })
  return array
})
</script>

<template>
  <h1>Statistics</h1>
  positive transactions: {{ positiveTransactionsInstances }} <br />total gains:
  {{ positiveTransactionsGain }} <br />negative transactions: {{ negativeTransactionsInstances }}
  <br />total losses: {{ negativeTransactionsLosses }} <br />total transactions:
  {{ totalTransactionsInstances }} <br />total difference: {{ totalTransactionsSum }}
  <PieChart class="chart" name="transactions by category" :input="transactionInstancesByCategory" />
  <PieChart class="chart" name="gains by category" :input="transactionGainsByCategory" />
  <PieChart class="chart" name="losses by category" :input="transactionLossesByCategory" />
  <BarChart class="chart--tall" name="transactions history" :input="transactionsChronologically" />
</template>

<style lang="scss">
.chart {
  margin-top: 20px;
  height: 270px;

  &--tall {
    margin-top: 20px;
    height: 800px;
  }
}
</style>

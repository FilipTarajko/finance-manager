<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
import PieChart from '@/components/Statistics/PieChart.vue'
import BarChart from '@/components/Statistics/BarChart.vue'
import { computed } from 'vue'
const categoriesStore = useCategoriesStore()
import { useCurrenciesStore } from '@/stores/currenciesStore'
import type { Currency, TransactionWithoutCategoryData } from '@/types/types';
const currenciesStore = useCurrenciesStore()

import { useThemeStore } from "@/stores/themeStore"
const themeStore = useThemeStore()

const props = defineProps<{
  minTimestamp: number,
  maxTimestamp: number,
  filter_currency_id: number | null,
  display_currency: Currency
}>();

function preparePieGraphInput(array: []) {
  return array.sort((a: any, b: any) => b.value - a.value)
}

function recalculateTransactionToMatchCurrency(transaction: TransactionWithoutCategoryData, target_currency: Currency) {
  return {
    ...transaction,
    amount: transaction.amount * currenciesStore.getCurrencyByTransaction(transaction)?.value_relative_to_default! / target_currency.value_relative_to_default
  }
}

const transactionInstancesByCategory = computed(() => {
  let array: any = []
  categoriesStore.categories.forEach((category) => {
    let value = category.transactions
      .filter(transaction => transaction.timestamp <= props.maxTimestamp)
      .filter(transaction => transaction.timestamp >= props.minTimestamp)
      .filter(transaction => props.filter_currency_id == null || currenciesStore.getCurrencyByTransaction(transaction)?.id == props.filter_currency_id)
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
      .filter(transaction => props.filter_currency_id == null || currenciesStore.getCurrencyByTransaction(transaction)?.id == props.filter_currency_id)
      .reduce((sum, elem) => sum + recalculateTransactionToMatchCurrency(elem, props.display_currency).amount, 0)
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
      .filter(transaction => props.filter_currency_id == null || currenciesStore.getCurrencyByTransaction(transaction)?.id == props.filter_currency_id)
      .reduce((sum, elem) => sum - recalculateTransactionToMatchCurrency(elem, props.display_currency).amount, 0)
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
    if (props.filter_currency_id != null && currenciesStore.getCurrencyByTransaction(elem)?.id != props.filter_currency_id) {
      continue;
    }
    array.push({
      name: elem.name,
      value: recalculateTransactionToMatchCurrency(elem, props.display_currency).amount.toFixed(2),
      itemStyle: {
        color: elem.categoryData.color
      }
    })
  }
  // @ts-ignore
  array.sort((a, b) => b.timestamp - a.timestamp)
  return array
})
</script>


<template>
  <h2>charts</h2>
  <div
    v-if="categoriesStore.transactions.length"
    :key="themeStore.darkTheme.toString()"
  >
    <PieChart
      class="chart"
      name="transactions by category"
      :input="transactionInstancesByCategory"
    />
    <PieChart
      class="chart"
      :name="'gains by category (in ' + display_currency.name + ')'"
      :input="transactionGainsByCategory"
    />
    <PieChart
      class="chart"
      :name="'losses by category (in ' + display_currency.name + ')'"
      :input="transactionLossesByCategory"
    />
    <BarChart
      class="chart chart--tall chart--last"
      :name="'transaction history (values in ' + display_currency.name + ')'"
      subtitle="with zoom"
      :input="transactionsChronologicallyForBarChart"
    />
  </div>
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
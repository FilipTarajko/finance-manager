<script setup lang="ts">
import StatisticsTable from '@/components/Statistics/StatisticsTable.vue'
import StatisticsCharts from '@/components/Statistics/StatisticsCharts.vue'
import { computed, ref } from 'vue';
import { useCurrenciesStore } from '@/stores/currenciesStore';
const currenciesStore = useCurrenciesStore();

let minTimestamp = ref(0)
let maxTimestamp = ref(new Date().getTime())
let filter_currency_id = ref(null)
let displayed_currency = ref(currenciesStore.getCurrencyById(currenciesStore.default_currency_id)!)
// let is_changing_currency_to_match_filter = ref(true)

const filterCurrencyOptions = computed(() => {
  return [{
    title: "any",
    value: null
  }, ...currenciesStore.currencies.map((currency) => {
    return {
      title: currency.name,
      value: currency.id
    }
  })]
})

const displayCurrencyOptions = computed(() => {
  return currenciesStore.currencies.map((currency) => {
    return {
      title: currency.name,
      value: currency
    }
  })
})

</script>

<template>
  <h1>Statistics</h1>

  <h2>filters</h2>
  <v-text-field
    v-model.number="minTimestamp"
    type="number"
    label="minTimestamp"
  >
  </v-text-field>
  <v-text-field
    v-model.number="maxTimestamp"
    type="number"
    label="maxTimestamp"
  >
  </v-text-field>
  <v-select
    v-model="filter_currency_id"
    :items="filterCurrencyOptions"
    label="Filter by currency"
    class="mb-2"
  ></v-select>
  <v-select
    v-model="displayed_currency"
    :items="displayCurrencyOptions"
    label="Display currency"
    class="mb-2"
  ></v-select>
  <!-- <v-switch
    v-model="is_changing_currency_to_match_filter"
    label="Automatically change display currency to match filter currency"
  >
  </v-switch> -->

  <StatisticsTable
    :minTimestamp="minTimestamp"
    :maxTimestamp="maxTimestamp"
    :currency_id="filter_currency_id"
    :display_currency="displayed_currency"
  ></StatisticsTable>
  <StatisticsCharts
    :minTimestamp="minTimestamp"
    :maxTimestamp="maxTimestamp"
    :filter_currency_id="filter_currency_id"
    :display_currency="displayed_currency"
  ></StatisticsCharts>
</template>

<script setup lang="ts">
import StatisticsTable from '@/components/Statistics/StatisticsTable.vue'
import StatisticsCharts from '@/components/Statistics/StatisticsCharts.vue'
import { computed, ref } from 'vue';
import { useCurrenciesStore } from '@/stores/currenciesStore';
const currenciesStore = useCurrenciesStore();

let minTimestamp = ref(0)
let maxTimestamp = ref(new Date().getTime())
let currency_id = ref(null)

const currencyOptions = computed(() => {
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
    v-model="currency_id"
    :items="currencyOptions"
    label="Currency"
    class="mb-2"
  ></v-select>

  <StatisticsTable
    :minTimestamp="minTimestamp"
    :maxTimestamp="maxTimestamp"
    :currency_id="currency_id"
  ></StatisticsTable>
  <StatisticsCharts
    :minTimestamp="minTimestamp"
    :maxTimestamp="maxTimestamp"
    :currency_id="currency_id"
  ></StatisticsCharts>
</template>

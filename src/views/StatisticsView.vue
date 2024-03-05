<script setup lang="ts">
import StatisticsTable from '@/components/Statistics/StatisticsTable.vue'
import StatisticsCharts from '@/components/Statistics/StatisticsCharts.vue'
import { computed, ref } from 'vue';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import { watch } from 'vue';
const currenciesStore = useCurrenciesStore();

const minTimestamp = ref(0)
const maxTimestamp = ref(new Date().getTime())
const filter_currency_id = ref(null)
const displayed_currency = ref(currenciesStore.getCurrencyById(currenciesStore.default_currency_id)!)
const is_changing_currency_to_match_filter = ref(true)

watch([filter_currency_id, is_changing_currency_to_match_filter], () => {
  if (is_changing_currency_to_match_filter.value && filter_currency_id.value != null) {
    displayed_currency.value = currenciesStore.getCurrencyById(filter_currency_id.value)!
  }
})

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
  <div style="display: flex; flex-direction: row;;">
    <v-text-field
      class="mr-2"
      v-model.number="minTimestamp"
      type="number"
      label="minTimestamp"
    >
    </v-text-field>
    <v-text-field
      class="ml-2"
      v-model.number="maxTimestamp"
      type="number"
      label="maxTimestamp"
    >
    </v-text-field>
  </div>
  <v-select
    v-model="filter_currency_id"
    :items="filterCurrencyOptions"
    label="Filter by currency"
    class="mb-2"
  ></v-select>
  <h2>display settings</h2>
  <v-select
    v-model="displayed_currency"
    :items="displayCurrencyOptions"
    label="Display currency"
    class="mb-2"
  ></v-select>
  <v-switch
    style="margin-top: -2rem;"
    v-model="is_changing_currency_to_match_filter"
    label="Automatically change display currency to match filter currency"
  >
  </v-switch>

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

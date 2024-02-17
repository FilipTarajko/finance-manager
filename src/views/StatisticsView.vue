<script setup lang="ts">
import StatisticsTable from '@/components/StatisticsTable.vue'
import StatisticsCharts from '@/components/StatisticsCharts.vue'
import { ref } from 'vue';

let minTimestamp = ref(0)
let maxTimestamp = ref(new Date().getTime())
</script>

<template>
  <h1>Statistics</h1>
  <h2>Timestamp range (only for table)</h2>
  <v-text-field
    v-model="minTimestamp"
    type="number"
    label="minTimestamp"
  >
  </v-text-field>
  <v-text-field
    v-model="maxTimestamp"
    type="number"
    label="maxTimestamp"
  >
  </v-text-field>
  <StatisticsTable
    :minTimestamp="minTimestamp"
    :maxTimestamp="maxTimestamp"
  ></StatisticsTable>
  <StatisticsCharts></StatisticsCharts>
</template>

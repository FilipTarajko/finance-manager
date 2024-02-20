<script setup lang="ts">
import StatisticsTable from '@/components/Statistics/StatisticsTable.vue'
import StatisticsCharts from '@/components/Statistics/StatisticsCharts.vue'
import { ref } from 'vue';

let minTimestamp = ref(0)
let maxTimestamp = ref(new Date().getTime())
</script>

<template>
  <h1>Statistics</h1>
  <h2>timestamp range</h2>
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
  <StatisticsTable
    :minTimestamp="minTimestamp"
    :maxTimestamp="maxTimestamp"
  ></StatisticsTable>
  <StatisticsCharts
    :minTimestamp="minTimestamp"
    :maxTimestamp="maxTimestamp"
  ></StatisticsCharts>
</template>

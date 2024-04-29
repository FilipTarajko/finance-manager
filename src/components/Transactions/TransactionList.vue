<script setup lang="ts">
import TransactionComponent from '@/components/Transactions/TransactionComponent.vue'
import type { TransactionWithCategoryData } from '@/types/types'

defineProps<{
  showDialog: Function
  transactions: TransactionWithCategoryData[]
}>()
</script>

<template>
  <template v-if="transactions.length">
    <v-card style="padding: 0.5rem">
      <v-virtual-scroll :maxHeight="300" :items="transactions">
        <template v-slot:default="{ item }">
          <TransactionComponent :transaction="item" :showDialog="showDialog"></TransactionComponent>
        </template>
      </v-virtual-scroll>
    </v-card>
  </template>
  <template v-else> There are no transactions<br /> </template>
</template>

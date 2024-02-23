<script setup lang="ts">
import TransactionComponent from '@/components/Transactions/TransactionComponent.vue'
import type { TransactionWithCategoryData } from '@/types/types';
import { computed } from 'vue';

const height_limit = 300
const height_per_transaction = 25.5
const height_after_last_transaction = 15

const props = defineProps<{
  showDialog: Function,
  transactions: TransactionWithCategoryData[]
}>()

const height_for_all_transactions = computed(() => {
  return props.transactions.length * height_per_transaction + height_after_last_transaction;
})

const height = computed(() => {
  if (height_for_all_transactions.value < height_limit) {
    return height_for_all_transactions.value;
  } else {
    return height_limit;
  }
})
</script>

<template>
  <template v-if="transactions.length">

    <v-card width="500">
      <v-virtual-scroll
        :height="height"
        :items="transactions"
      >
        <template v-slot:default="{ item }">
          <TransactionComponent
            :transaction=item
            :showDialog=showDialog
          ></TransactionComponent>
        </template>
      </v-virtual-scroll>
    </v-card>
  </template>
  <template v-else>
    There are no transactions<br>
  </template>
</template>
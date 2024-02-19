<script setup lang="ts">
import TransactionComponent from '@/components/Transactions/TransactionComponent.vue'
import type { TransactionWithCategoryData } from '@/types/types';

defineProps<{
  showDialog: Function,
  transactions: TransactionWithCategoryData[]
}>()


</script>

<template>
  <template v-if="transactions.length">

    <v-card width="500">
      <v-virtual-scroll
        :height="300"
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
    There are no transactions
  </template>
</template>
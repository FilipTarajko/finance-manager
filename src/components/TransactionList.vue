<script setup lang="ts">
import TransactionComponent from '@/components/TransactionComponent.vue'
import type { TransactionWithCategoryData } from '@/types/types';

defineProps<{
  showDialog: Function,
  transactions: TransactionWithCategoryData[]
}>()


</script>

<template>
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
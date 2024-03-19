<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import type { TransactionWithCategoryData } from '@/types/types'

defineProps<{
  transaction: TransactionWithCategoryData,
  showDialog: Function
}>()

const categoriesStore = useCategoriesStore();
const currenciesStore = useCurrenciesStore();

</script>


<template>
  <div style="display: flex; flex-direction: row;">
    <div style="width: 25%;">
      <RouterLink :to="{ name: 'transaction', params: { transactionId: transaction.id } }">
        {{ transaction.name }}
      </RouterLink>
    </div>
    <div style="width: 25%; margin-right: 1ch; text-align: right;">
      {{ transaction.amount.toFixed(2) }}
    </div>
    <div style="width: 13%;">
      {{ currenciesStore.getCurrencyNameByTransaction(transaction) }}
    </div>
    <div style="width: 30%;">
      <span :style="{ color: transaction.categoryData.color }">
        <v-icon :icon="transaction.categoryData.icon" /> {{ transaction.categoryData.name }} </span>
    </div>
    <div style="width: 7%;">
      <v-icon @click="showDialog(transaction)" class="edit-button" icon="mdi-pencil" aria-label="edit transaction"
        style="color: yellow" />
      <v-icon icon="mdi-delete" class="remove-button" style="color: red" aria-label="delete transaction"
        @click="categoriesStore.deleteTransaction(transaction)"></v-icon>
    </div>
  </div>
</template>
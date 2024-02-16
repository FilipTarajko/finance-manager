<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore';
import type { TransactionWithCategoryData } from '@/types/types'

defineProps<{
  transaction: TransactionWithCategoryData,
  showDialog: Function
}>()

const categoriesStore = useCategoriesStore();

</script>


<template>
  <RouterLink :to="{ name: 'transaction', params: { transactionId: transaction.id } }">
    {{ transaction.name }}
  </RouterLink>
  : {{ transaction.amount.toFixed(2) }} (
  <span :style="{ color: transaction.categoryData.color }">
    <v-icon :icon="transaction.categoryData.icon" />{{ transaction.categoryData.name }} </span>)
  <v-icon
    @click="showDialog(transaction)"
    class="edit-button"
    icon="mdi-pencil"
    aria-label="edit transaction"
    style="color: yellow"
  />
  <v-icon
    icon="mdi-delete"
    class="remove-button"
    style="color: red"
    aria-label="delete transaction"
    @click="categoriesStore.deleteTransaction(transaction)"
  ></v-icon>
</template>
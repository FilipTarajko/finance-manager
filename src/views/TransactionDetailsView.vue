<script setup lang="ts">
import { useCategoriesStore } from '../stores/categoriesStore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const categoriesStore = useCategoriesStore()
const route = useRoute()

const transaction = computed(() => {
  return categoriesStore.transactions.find((e) => e.id == (route.params.transactionId as any))
})
</script>

<template>
  <main>
    <h1>Transaction</h1>
    <template v-if="transaction">
      {{ transaction.id }} - {{ transaction.name }}: {{ transaction.amount }} ({{
        transaction.categoryData.name
      }})
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

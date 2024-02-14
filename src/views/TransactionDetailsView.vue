<script setup lang="ts">
import { useCategoriesStore } from '../stores/categoriesStore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const categoriesStore = useCategoriesStore()
const route = useRoute()

const transaction = computed(() => {
  // TODO - replace with find?
  return categoriesStore.transactions.filter((e) => e.id == (route.params.transactionId as any))[0]
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

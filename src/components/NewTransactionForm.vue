<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useTransactionStore } from '../stores/transactionStore'
const transactionsStore = useTransactionStore()
import { useCategoriesStore } from '../stores/categoriesStore'
import type { Category } from '@/types/types'
const categoriesStore = useCategoriesStore()

const name = ref('')
const amount = ref(0)
const category: Ref<null | Category> = ref(null)

function addTransaction() {
  if (!category.value) {
    return
  } else {
    transactionsStore.addTransaction(name.value, amount.value, category.value)
  }
}
</script>

<template>
  <h2>new transaction</h2>
  <form class="form" @submit.prevent="addTransaction">
    <input type="text" v-model="name" />
    <input type="number" step="0.01" v-model="amount" />
    <select v-model="category">
      <option disabled value="null">Select category</option>
      <option v-for="categoryOption in categoriesStore.categories" :value="categoryOption">
        {{ categoryOption.name }}
      </option>
    </select>
    <button :disabled="category == null">add</button>
  </form>
</template>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  width: 10rem;
}
</style>

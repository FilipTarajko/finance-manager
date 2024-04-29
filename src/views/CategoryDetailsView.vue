<script setup lang="ts">
import CategoryEditDialog from '@/components/Categories/CategoryEditDialog.vue'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import TransactionList from '@/components/Transactions/TransactionList.vue'
import CategoryComponent from '@/components/Categories/CategoryComponent.vue'
import { useCategoriesStore } from '../stores/categoriesStore'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionFormComposable } from '@/composables/transactionFormComposable'
const categoriesStore = useCategoriesStore()
const route = useRoute()

const isCategoryDialogShown = ref(false)

function showCategoryDialog() {
  isCategoryDialogShown.value = true
}

const { isTransactionDialogShown, dialogTransaction, showTransactionDialog } =
  useTransactionFormComposable()

const category = computed(() => {
  return categoriesStore.categories.find((e) => e.id == (route.params.categoryId as any))
})

const transactionsInCategory = computed(() => {
  return categoriesStore.transactions.filter(
    (transaction) => transaction.categoryData.name == category.value?.name
  )
})
</script>

<template>
  <main>
    <h1>Category</h1>
    <template v-if="category">
      <CategoryComponent :category="category" @showDialog="showCategoryDialog"></CategoryComponent>
      <CategoryEditDialog v-model="isCategoryDialogShown" :editedCategory="category">
      </CategoryEditDialog>
      <h2>Transactions</h2>
      <TransactionList
        :transactions="transactionsInCategory"
        :showDialog="showTransactionDialog"
      ></TransactionList>
      <TransactionEditDialog
        v-model="isTransactionDialogShown"
        :transaction="dialogTransaction"
      ></TransactionEditDialog>
    </template>

    <template v-else> Category not found </template>
  </main>
</template>

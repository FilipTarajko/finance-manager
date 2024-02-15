<script setup lang="ts">
import CategoryForm from '@/components/CategoryForm.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionList from '@/components/TransactionList.vue'
import CategoryComponent from '@/components/CategoryComponent.vue'
import { useCategoriesStore } from '../stores/categoriesStore'
import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import type { TransactionWithCategoryData } from '@/types/types'
const categoriesStore = useCategoriesStore()
const route = useRoute()

let isCategoryDialogShown = ref(false)

function showCategoryDialog() {
  isCategoryDialogShown.value = true
}

function hideCategoryDialog() {
  isCategoryDialogShown.value = false
}

let isTransactionDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

function showTransactionDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isTransactionDialogShown.value = true
}

function hideTransactionDialog() {
  isTransactionDialogShown.value = false
}

const category = computed(() => {
  return categoriesStore.categories.find((e) => e.id == (route.params.categoryId as any))
})

const transactionsInCategory = computed(() => {
  return categoriesStore.transactions.filter(transaction => transaction.categoryData.name == category.value?.name)
})
</script>

<template>
  <main>
    <h1>Category</h1>
    <template v-if="category">
      <CategoryComponent
        :category="category"
        :showDialog="showCategoryDialog"
      ></CategoryComponent>
      <v-dialog
        width="auto"
        v-model="isCategoryDialogShown"
      >
        <v-card theme="dark">
          <v-card-text>
            <CategoryForm
              :category="category"
              :hideDialog="hideCategoryDialog"
            > </CategoryForm>
          </v-card-text>
        </v-card>
      </v-dialog>
      <h2>Transactions</h2>
      <template v-if="transactionsInCategory.length">
        <TransactionList
          :transactions="transactionsInCategory"
          :showDialog="showTransactionDialog"
        ></TransactionList>
        <v-dialog
          width="auto"
          v-model="isTransactionDialogShown"
        >
          <v-card>
            <v-card-text>
              <TransactionForm
                :transaction="dialogTransaction"
                :hideDialog="hideTransactionDialog"
              >
              </TransactionForm>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
      <template v-else>
        There are no transactions in this category
      </template>
    </template>
    <template v-else> Category not found </template>
  </main>
</template>

import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { type Category, type Transaction } from '../types/types'
import { useCategoriesStore } from '../stores/categoriesStore'

export const useTransactionsStore = defineStore('transactionsStore', () => {
  const categoriesStore = useCategoriesStore()
  const transactions: Ref<Transaction[]> = ref([
    {
      id: 1,
      name: 'Dinner',
      amount: -20,
      category: categoriesStore.categories[0],
      timestamp: new Date().getTime()
    },
    {
      id: 2,
      name: 'Scholarship',
      amount: 1000,
      category: categoriesStore.categories[1],
      timestamp: new Date().getTime()
    },
    {
      id: 3,
      name: 'Groceries',
      amount: 60.53,
      category: categoriesStore.categories[2],
      timestamp: new Date().getTime()
    }
  ])

  const positiveTransactions = computed(() => transactions.value.filter((elem) => elem.amount > 0))

  const negativeTransactions = computed(() => transactions.value.filter((elem) => elem.amount < 0))

  function addTransaction(name: string, amount: number, category: Category) {
    let nextId = 0
    for (const elem of transactions.value) {
      if (nextId <= elem.id) {
        nextId = elem.id + 1
      }
    }
    transactions.value.push({
      id: nextId,
      name,
      amount,
      category,
      timestamp: new Date().getTime()
    })
  }

  return { transactions, positiveTransactions, negativeTransactions, addTransaction }
})

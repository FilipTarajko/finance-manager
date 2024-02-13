import { computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { type Category, type Transaction } from '../types/types'
import { useCategoriesStore } from '../stores/categoriesStore'
import { useStorage } from '@vueuse/core'

export const useTransactionsStore = defineStore('transactionsStore', () => {
  const categoriesStore = useCategoriesStore()
  const transactions: Ref<Transaction[]> = useStorage('transactions', [
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
      amount: -61.53,
      category: categoriesStore.categories[2],
      timestamp: new Date().getTime()
    },
    {
      id: 4,
      name: 'Pizza',
      amount: -19.99,
      category: categoriesStore.categories[0],
      timestamp: new Date().getTime()
    },
    {
      id: 5,
      name: 'Gift from grandma',
      amount: 200,
      category: categoriesStore.categories[3],
      timestamp: new Date().getTime()
    },
    {
      id: 6,
      name: 'Gas',
      amount: -250,
      category: categoriesStore.categories[4],
      timestamp: new Date().getTime()
    },
    {
      id: 7,
      name: 'Bus ticket',
      amount: -10,
      category: categoriesStore.categories[4],
      timestamp: new Date().getTime()
    },
    {
      id: 7,
      name: 'Test',
      amount: -15,
      category: categoriesStore.categories[5],
      timestamp: new Date().getTime()
    },
    {
      id: 8,
      name: 'Test',
      amount: -15,
      category: categoriesStore.categories[6],
      timestamp: new Date().getTime()
    },
    {
      id: 9,
      name: 'Test',
      amount: -15,
      category: categoriesStore.categories[7],
      timestamp: new Date().getTime()
    },
    {
      id: 10,
      name: 'Test',
      amount: -15,
      category: categoriesStore.categories[8],
      timestamp: new Date().getTime()
    },
    {
      id: 11,
      name: 'Test',
      amount: -15,
      category: categoriesStore.categories[9],
      timestamp: new Date().getTime()
    },
    {
      id: 12,
      name: 'Test',
      amount: -35,
      category: categoriesStore.categories[10],
      timestamp: new Date().getTime()
    },
    {
      id: 13,
      name: 'TestAgain',
      amount: -35,
      category: categoriesStore.categories[11],
      timestamp: new Date().getTime()
    }
  ])

  const positiveTransactions = computed(() => transactions.value.filter((elem) => elem.amount > 0))

  const negativeTransactions = computed(() => transactions.value.filter((elem) => elem.amount < 0))

  function createAndAddTransaction(name: string, amount: number, category: Category) {
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

  function editExistingTransaction(transaction: Transaction, newState: any) {
    transaction.amount = newState.amount
    transaction.category = newState.category
    transaction.name = newState.name
  }

  function deleteTransaction(transaction: Transaction) {
    transactions.value = transactions.value.filter((elem) => elem != transaction)
  }

  return {
    transactions,
    positiveTransactions,
    negativeTransactions,
    createAndAddTransaction,
    editExistingTransaction,
    deleteTransaction
  }
})

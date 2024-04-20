import { computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Category,
  type TransactionWithCategoryData,
  type TransactionWithoutCategoryData
} from '../types/types'
import { useStorage } from '@vueuse/core'

import defaultData from './smallData.json'

export const useCategoriesStore = defineStore('categories', () => {
  const categories: Ref<Category[]> = useStorage('categories', defaultData)

  function createAndAddCategory(name: string, color: string, icon: string) {
    let nextId = 0
    for (const elem of categories.value) {
      if (nextId <= elem.id) {
        nextId = elem.id + 1
      }
    }
    categories.value.push({
      id: nextId,
      name,
      color,
      icon,
      transactions: []
    })
  }

  function editExistingCategory(category: Category, newState: { name: string, color: string, icon: string }) {
    category.name = newState.name
    category.color = newState.color
    category.icon = newState.icon
  }

  const transactions = computed(() => {
    const result: TransactionWithCategoryData[] = []
    for (let i = 0; i < categories.value.length; i++) {
      const category = categories.value[i]
      for (let j = 0; j < category.transactions.length; j++) {
        result.push({
          ...category.transactions[j],
          categoryData: {
            id: category.id,
            name: category.name,
            color: category.color,
            icon: category.icon
          }
        })
      }
    }
    result.sort((a, b) => a.timestamp - b.timestamp)
    return result
  })

  const positiveTransactions = computed(() =>
    transactions.value.filter((elem: { amount: number }) => elem.amount > 0)
  )

  const negativeTransactions = computed(() =>
    transactions.value.filter((elem: { amount: number }) => elem.amount < 0)
  )

  function createAndAddTransaction(name: string, amount: number, category: Category, account_id: number) {
    let nextId = 0
    for (const elem of transactions.value) {
      if (nextId <= elem.id) {
        nextId = elem.id + 1
      }
    }
    category.transactions.push({
      id: nextId,
      name,
      amount,
      timestamp: new Date().getTime(),
      account_id
    })
  }

  function editExistingTransaction(transaction: TransactionWithoutCategoryData, newState: any) {
    const category = getCategoryByTransaction(transaction)
    const index = category.transactions.findIndex((e) => e.id == transaction.id)
    category.transactions[index].amount = newState.amount
    category.transactions[index].name = newState.name
    category.transactions[index].account_id = newState.account_id
    if (newState.category != category) {
      const movedTransaction = category.transactions.splice(index, 1)[0];
      newState.category.transactions.push(movedTransaction);
    }
  }

  function tryGetCategoryByName(searchedName: String): Category | undefined {
    return categories.value.find(category => category.name == searchedName)
  }

  // @ts-ignore
  function getCategoryByTransaction(transaction: TransactionWithoutCategoryData): Category {
    for (let i = 0; i < categories.value.length; i++) {
      const category = categories.value[i]
      if (category.transactions.map((e) => e.id).includes(transaction.id)) {
        return category
      }
    }
  }

  function deleteTransaction(transaction: TransactionWithoutCategoryData) {
    const category = getCategoryByTransaction(transaction)
    category.transactions = category.transactions.filter(
      (elem: TransactionWithoutCategoryData) => elem.id != transaction.id
    )
  }

  function deleteCategory(category: Category) {
    categories.value = categories.value.filter(elem => elem != category)
  }

  return {
    categories,
    createAndAddCategory,
    editExistingCategory,
    createAndAddTransaction,
    positiveTransactions,
    negativeTransactions,
    deleteTransaction,
    editExistingTransaction,
    tryGetCategoryByName,
    transactions,
    deleteCategory
  }
})

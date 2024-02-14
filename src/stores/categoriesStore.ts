import { computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Category,
  type TransactionWithCategoryData,
  type TransactionWithoutCategoryData
} from '../types/types'
import { useStorage } from '@vueuse/core'

import defaultData from './fakerData.json'

export const useCategoriesStore = defineStore('categoriesStore', () => {
  // @ts-ignore
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

  function editExistingCategory(category: Category, newState: any) {
    console.log(newState)
    category.name = newState.name
    category.color = newState.color
    category.icon = newState.icon
  }

  const transactions = computed(() => {
    let result: TransactionWithCategoryData[] = []
    console.time("x")
    for (let i = 0; i < categories.value.length; i++) {
      let category = categories.value[i];
      for (let j = 0; j < category.transactions.length; j++) {
        result.push({
          ...category.transactions[j],
          categoryData: {
            name: category.name,
            color: category.color,
            icon: category.icon
          }
        })
      }
    }
    console.timeEnd("x")
    console.time("sort")
    result.sort((a, b) => a.timestamp - b.timestamp)
    console.timeEnd("sort")
    return result
  })

  const positiveTransactions = computed(() =>
    transactions.value.filter((elem: { amount: number }) => elem.amount > 0)
  )

  const negativeTransactions = computed(() =>
    transactions.value.filter((elem: { amount: number }) => elem.amount < 0)
  )

  function createAndAddTransaction(name: string, amount: number, category: Category) {
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
      timestamp: new Date().getTime()
    })
  }

  function editExistingTransaction(transaction: TransactionWithoutCategoryData, newState: any) {
    let category = getCategoryByTransaction(transaction);
    let index = category.transactions.findIndex(e => e.id == transaction.id)
    category.transactions[index].amount = newState.amount
    category.transactions[index].name = newState.name
  }

  // @ts-ignore
  function getCategoryByTransaction(transaction: TransactionWithoutCategoryData): Category {
    for (let i = 0; i < categories.value.length; i++) {
      let category = categories.value[i];
      if (category.transactions.map(e => e.id).includes(transaction.id)) {
        return category
      }
    }
    console.log("nope")
  }

  function deleteTransaction(transaction: TransactionWithoutCategoryData) {
    const category = getCategoryByTransaction(transaction)
    category.transactions = category.transactions.filter(
      (elem: TransactionWithoutCategoryData) => elem.id != transaction.id
    )
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
    transactions
  }
})

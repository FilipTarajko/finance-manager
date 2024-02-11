import { setActivePinia, createPinia } from 'pinia'
import { useTransactionStore } from '../transactionStore'
import { describe, beforeEach, it, expect } from 'vitest'
import type { Category } from '@/types/types'

describe('transactionStore', () => {
  let testCategory: Category = {
    id: 0,
    name: 'testCategoryName',
    color: '#ffffff',
    icon: ''
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds new transactions', () => {
    const transactionsStore = useTransactionStore()
    transactionsStore.addTransaction('test transaction', -12.34, testCategory)
    let lastElement = transactionsStore.transactions[transactionsStore.transactions.length - 1]
    expect(lastElement.name).toEqual('test transaction')
    expect(lastElement.amount).toEqual(-12.34)
    expect(lastElement.category.name).toEqual('testCategoryName')
  })
})

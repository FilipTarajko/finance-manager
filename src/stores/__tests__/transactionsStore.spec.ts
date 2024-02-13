import { setActivePinia, createPinia } from 'pinia'
import { useTransactionsStore } from '../transactionsStore'
import { describe, beforeEach, it, expect } from 'vitest'
import type { Category } from '@/types/types'

describe('transactionStore', () => {
  const testCategory: Category = {
    id: 0,
    name: 'testCategoryName',
    color: '#ffffff',
    icon: ''
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds new transactions', () => {
    const transactionsStore = useTransactionsStore()
    transactionsStore.addTransaction('test transaction', -12.34, testCategory)
    const lastElement = transactionsStore.transactions[transactionsStore.transactions.length - 1]
    expect(lastElement.name).toEqual('test transaction')
    expect(lastElement.amount).toEqual(-12.34)
    expect(lastElement.category.name).toEqual('testCategoryName')
  })
})

// import { setActivePinia, createPinia } from 'pinia'
// import { describe, beforeEach, it, expect } from 'vitest'
// import type { Category } from '@/types/types'

// describe('transactionStore', () => {
//   const testCategory: Category = {
//     id: 0,
//     name: 'testCategoryName',
//     color: '#ffffff',
//     icon: '',
//     transactions: [
//       {
//         id: 0,
//         name: 'test',
//         amount: 3,
//         timestamp: 1707873261475
//       }
//     ]
//   }

//   beforeEach(() => {
//     setActivePinia(createPinia())
//   })

//   it('creates new transaction', () => {
//     expect(true).toEqual(false)
//     const transactionsStore = useTransactionsStore()
//     transactionsStore.createAndAddTransaction('test transaction', -12.34, testCategory)
//     const testElement = transactionsStore.transactions[transactionsStore.transactions.length - 1]
//     expect(testElement.name).toEqual('test transaction')
//     expect(testElement.amount).toEqual(-12.34)
//     expect(testElement.category.name).toEqual('testCategoryName')
//   })

//   it('deletes existing transaction', () => {
//     const transactionsStore = useTransactionsStore()
//     const testElement = transactionsStore.transactions[transactionsStore.transactions.length - 1]
//     const lengthBeforeRemoving = transactionsStore.transactions.length
//     transactionsStore.deleteTransaction(testElement)
//     expect(transactionsStore.transactions.length).toStrictEqual(lengthBeforeRemoving - 1)
//     expect(transactionsStore.transactions).not.toContain(testElement)
//   })
// })

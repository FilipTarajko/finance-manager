import { type Ref } from 'vue'
import { defineStore } from 'pinia'
import { type Account } from '../types/types'
import { useStorage } from '@vueuse/core'
import defaultAccounts from './defaultAccounts.json'
import { useCategoriesStore } from '@/stores/categoriesStore'

export const useAccountsStore = defineStore('accounts', () => {
  const categoriesStore = useCategoriesStore()
  const default_account_id: Ref<number> = useStorage('default_account_id', 0)
  const accounts: Ref<Account[]> = useStorage('accounts', defaultAccounts)

  function editExistingAccount(account: Account, newState: { name: string; currency_id: number }) {
    const index = accounts.value.findIndex((e) => e.id == account.id)
    accounts.value[index].name = newState.name
    accounts.value[index].currency_id = newState.currency_id
  }

  function createAndAddAccount(name: string, currency_id: number) {
    let nextId = 1
    for (const elem of accounts.value) {
      if (nextId <= elem.id) {
        nextId = elem.id + 1
      }
    }
    accounts.value.push({
      id: nextId,
      name,
      currency_id
    })
  }

  function getAccountById(id: number): Account {
    return accounts.value.find((elem) => elem.id == id) as Account
  }

  function deleteAccount(account: Account) {
    accounts.value = accounts.value.filter((elem) => elem != account)
    categoriesStore.categories.forEach((category) => {
      category.transactions.forEach((transaction) => {
        if (transaction.account_id == account.id) {
          categoriesStore.deleteTransaction(transaction)
        }
      })
    })
    if (account.id == default_account_id.value) {
      default_account_id.value = accounts.value[0].id
    }
  }

  return {
    accounts,
    editExistingAccount,
    createAndAddAccount,
    getAccountById,
    deleteAccount,
    default_account_id
  }
})

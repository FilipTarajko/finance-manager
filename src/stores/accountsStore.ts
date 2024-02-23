import { type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Account
} from '../types/types'
import { useStorage } from '@vueuse/core'

import defaultAccounts from './defaultAccounts.json'

export const useAccountsStore = defineStore('accountsStore', () => {
  const accounts: Ref<Account[]> = useStorage('accounts', defaultAccounts)

  function editExistingAccount(account: Account, newState: { name: string, currency_id: number }) {
    const index = accounts.value.findIndex((e) => e.id == account.id)
    accounts.value[index].name = newState.name
    accounts.value[index].currency_id = newState.currency_id
  }

  function createAndAddAccount(name: string, currency_id: number) {
    let nextId = 0
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

  function deleteAccount(account: Account) {
    accounts.value = accounts.value.filter(elem => elem != account)
  }

  return {
    accounts,
    editExistingAccount,
    createAndAddAccount,
    deleteAccount
  }
})

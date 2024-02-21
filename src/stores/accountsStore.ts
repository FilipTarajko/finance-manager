import { type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Account
} from '../types/types'
import { useStorage } from '@vueuse/core'

import defaultAccounts from './defaultAccounts.json'

export const useAccountsStore = defineStore('accountsStore', () => {
  const accounts: Ref<Account[]> = useStorage('accounts', defaultAccounts)

  return {
    accounts
  }
})

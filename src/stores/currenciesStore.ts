import { type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  type Account,
  type Currency,
  type TransactionWithoutCategoryData,
  type TransactionWithCategoryData
} from '../types/types'
import { useStorage } from '@vueuse/core'
import { useAccountsStore } from './accountsStore'
const accountsStore = useAccountsStore();

import defaultCurrencies from './defaultCurrencies.json'

export const useCurrenciesStore = defineStore('currenciesStore', () => {
  const default_currency_id: Ref<number> = useStorage('default_currency_id', 1)
  const currencies: Ref<Currency[]> = useStorage('currencies', defaultCurrencies)

  function getCurrencyById(id: number) {
    return currencies.value.find(e => e.id == id)
  }

  function getCurrencyNameByAccount(account: Account) {
    return currencies.value.find(e => e.id == account.currency_id)?.name
  }

  function getCurrencyNameByTransaction(transaction: TransactionWithoutCategoryData | TransactionWithCategoryData) {
    const account = accountsStore.accounts.find(acc => acc.id == transaction.account_id)
    return account && getCurrencyNameByAccount(account)
  }

  function getCurrencyByAccount(account: Account) {
    return currencies.value.find(e => e.id == account.currency_id)
  }

  function getCurrencyByTransaction(transaction: TransactionWithoutCategoryData | TransactionWithCategoryData) {
    const account = accountsStore.accounts.find(acc => acc.id == transaction.account_id)
    return account && getCurrencyByAccount(account)
  }

  function editExistingCurrency(currency: Currency, newState: { name: string, value: number }) {
    const index = currencies.value.findIndex((e) => e.id == currency.id)
    currencies.value[index].name = newState.name
    currencies.value[index].value = newState.value
  }

  function createAndAddCurrency(name: string, value: number) {
    let nextId = 0
    for (const elem of currencies.value) {
      if (nextId <= elem.id) {
        nextId = elem.id + 1
      }
    }
    currencies.value.push({
      id: nextId,
      name,
      value
    })
  }

  function deleteCurrency(currency: Currency) {
    currencies.value = currencies.value.filter(elem => elem != currency)
    accountsStore.accounts.forEach(account => {
      if (account.currency_id == currency.id) {
        accountsStore.deleteAccount(account)
      }
    })
  }


  return {
    currencies,
    default_currency_id,
    getCurrencyNameByAccount,
    getCurrencyNameByTransaction,
    getCurrencyByTransaction,
    getCurrencyById,
    editExistingCurrency,
    createAndAddCurrency,
    deleteCurrency
  }
})

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
  const default_currency_id: Ref<number> = useStorage('default_currency_id', 0)
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

  function getAccountIdsByCurrency(currency: Currency) {
    return accountsStore.accounts.filter(acc => acc.currency_id == currency.id).map(e => e.id)
  }

  function getAccountNamesByCurrency(currency: Currency) {
    return accountsStore.accounts.filter(acc => acc.currency_id == currency.id).map(e => e.name)
  }

  function editExistingCurrency(currency: Currency, newState: { name: string, value: number }) {
    const index = currencies.value.findIndex((e) => e.id == currency.id)
    currencies.value[index].name = newState.name
    currencies.value[index].value = newState.value
  }

  function createAndAddCurrency(name: string, value: number, create_account: boolean) {
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
    if (create_account) {
      accountsStore.createAndAddAccount(name, nextId)
    }
  }

  function deleteCurrency(currency: Currency) {
    currencies.value = currencies.value.filter(elem => elem != currency)
    accountsStore.accounts.forEach(account => {
      if (account.currency_id == currency.id) {
        accountsStore.deleteAccount(account)
      }
    })
    if (currency.id == default_currency_id.value) {
      default_currency_id.value = currencies.value[0].id
    }
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
    deleteCurrency,
    getAccountIdsByCurrency,
    getAccountNamesByCurrency
  }
})

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
import { useSnackbarStore } from '@/stores/snackbarStore';

import defaultCurrencies from './defaultCurrencies.json'

export const useCurrenciesStore = defineStore('currenciesStore', () => {
  const default_currency_id: Ref<number> = useStorage('default_currency_id', 1)
  const currencies: Ref<Currency[]> = useStorage('currencies', defaultCurrencies)

  const accountsStore = useAccountsStore();
  const snackbarStore = useSnackbarStore();

  const currenciesSupportedByApi = ['EUR', 'USD', 'JPY', 'BGN', 'CZK', 'DKK', 'GBP', 'HUF', 'PLN', 'RON', 'SEK', 'CHF', 'ISK', 'NOK', 'HRK', 'RUB', 'TRY', 'AUD', 'BRL', 'CAD', 'CNY', 'HKD', 'IDR', 'ILS', 'INR', 'KRW', 'MXN', 'MYR', 'NZD', 'PHP', 'SGD', 'THB', 'ZAR'];

  function getDefaultCurrency(): Currency {
    return currencies.value.find(currency => currency.id == default_currency_id.value)!
  }

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

  function updateValueOfDependentCurrencies(currency: Currency) {
    for (let i = 0; i < currencies.value.length; i++) {
      const currencyToUpdate = currencies.value[i];
      if (currencyToUpdate.base_currency_id == currency.id) {
        currencyToUpdate.value_relative_to_default = currency.value_relative_to_default * currencyToUpdate.value_relative_to_base;
        updateValueOfDependentCurrencies(currencyToUpdate);
      }
    }
  }

  function editExistingCurrency(currency: Currency, newState: { name: string, value_relative_to_base: number, base_currency_id: number, api_name: string }) {
    const index = currencies.value.findIndex((e) => e.id == currency.id)
    const editedCurrency = currencies.value[index]
    const oldValueRelativeToBose = editedCurrency.value_relative_to_base;
    editedCurrency.name = newState.name
    editedCurrency.value_relative_to_base = newState.value_relative_to_base
    editedCurrency.base_currency_id = newState.base_currency_id
    editedCurrency.value_relative_to_default = editedCurrency.value_relative_to_base * getCurrencyById(editedCurrency.base_currency_id)!.value_relative_to_default;
    editedCurrency.api_name = newState.api_name

    if (oldValueRelativeToBose != editedCurrency.value_relative_to_base) {
      updateValueOfDependentCurrencies(editedCurrency);
    }

    updateValuesWithApi()
  }

  function createAndAddCurrency(name: string, base_currency_id: number, value_relative_to_base: number, create_account: boolean, api_name: string) {
    let nextId = 1
    for (const elem of currencies.value) {
      if (nextId <= elem.id) {
        nextId = elem.id + 1
      }
    }
    currencies.value.push({
      id: nextId,
      name,
      base_currency_id,
      value_relative_to_base,
      value_relative_to_default: value_relative_to_base * getCurrencyById(base_currency_id)!.value_relative_to_default,
      api_name
    })
    if (create_account) {
      accountsStore.createAndAddAccount(name, nextId)
    }

    updateValuesWithApi()
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

  async function updateValuesWithApi() {
    const updated_currencies_array = []
    const changed_values_of_currencies = []
    try {
      for (let i = 0; i < currencies.value.length; i++) {
        const currency = currencies.value[i]
        const base_currency = getCurrencyById(currency.base_currency_id)
        if (currency.api_name && base_currency?.api_name && currency.id != default_currency_id.value) {
          const response = await fetch(`https://api.vatcomply.com/rates?base=${base_currency.api_name.toUpperCase()}`)
          const new_value_relative_to_base = (1 / (await response.json()).rates[currency.api_name.toUpperCase()])
          currency.value_relative_to_base = new_value_relative_to_base
          const old_value_relative_to_default = currency.value_relative_to_default;
          currency.value_relative_to_default = currency.value_relative_to_base * base_currency.value_relative_to_default
          updated_currencies_array.push(currency.name)
          if (old_value_relative_to_default != currency.value_relative_to_default) {
            changed_values_of_currencies.push(currency.name)
          }
        }
      }
      if (changed_values_of_currencies.length) {
        snackbarStore.showSnackbarMessage('green', `Updated rates of currencies: ${changed_values_of_currencies.join(', ')}`)
      }
      else if (updated_currencies_array.length) {
        snackbarStore.showSnackbarMessage('green', `Rates were checked, but all were already up to date`)
      } else {
        console.log(`No currencies were updated`)
        snackbarStore.showSnackbarMessage('yellow', `No rates matched API`)
      }
    } catch (error) {
      snackbarStore.showSnackbarMessage('red', `Could not fetch data`)
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
    getAccountNamesByCurrency,
    getDefaultCurrency,
    currenciesSupportedByApi,
    updateValuesWithApi
  }
})

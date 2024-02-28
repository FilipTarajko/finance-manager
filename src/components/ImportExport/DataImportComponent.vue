<script setup lang="ts">
import { ref } from 'vue';
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useAccountsStore } from '@/stores/accountsStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import type { Account, Category, Currency } from '@/types/types';
const categoriesStore = useCategoriesStore()
const accountsStore = useAccountsStore()
const currenciesStore = useCurrenciesStore()

let fileData = ref([])
let showJsonOnly = ref(true)
const textFieldData = ref("")
let snackbarText = ref('snackbar text')
let isSnackbarDisplayed = ref(false)
let snackbarColor = ref("red")

function tryImportFromFile() {
  const file = fileData.value[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = (e?.target?.result);
    if (data as string) {
      tryImportData(data as string);
    }
  };
  reader.readAsText(file);
}

function tryImportData(stringToImport: string) {
  const result = tryParseTextIntoData(stringToImport)
  if ("data" in result && result.data) {
    categoriesStore.categories = result.data.categories;
    accountsStore.default_account_id = result.data.default_account_id;
    currenciesStore.default_currency_id = result.data.default_currency_id;
    accountsStore.accounts = result.data.accounts;
    currenciesStore.currencies = result.data.currencies;

    snackbarColor.value = 'green'
    snackbarText.value = `Imported data with \n${result.data.categories.length} categories, \n${result.data.accounts.length} accounts, and \n${result.data.currencies.length} currencies.`
    isSnackbarDisplayed.value = true;
  } else {
    // @ts-ignore
    let errorMessage = result?.errorMessage ?? "unknown error"
    snackbarColor.value = 'red'
    snackbarText.value = errorMessage
    isSnackbarDisplayed.value = true;

  }
}
</script>

<script lang="ts">
export function isCategory(obj: unknown): obj is Category {
  return (
    (obj || false) &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'color' in obj &&
    typeof obj.color === 'string' &&
    'icon' in obj &&
    typeof obj.icon === 'string' &&
    'transactions' in obj &&
    Array.isArray(obj.transactions) &&
    obj.transactions.every(transaction =>
      transaction &&
      typeof transaction === 'object' &&
      'id' in transaction &&
      typeof transaction.id === 'number' &&
      'name' in transaction &&
      typeof transaction.name === 'string' &&
      'amount' in transaction &&
      typeof transaction.amount === 'number' &&
      'timestamp' in transaction &&
      typeof transaction.timestamp === 'number'
    )
  );
}

export function isAccount(obj: unknown): obj is Account {
  return (
    (obj || false) &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'currency_id' in obj &&
    typeof obj.currency_id === 'number'
  );
}

export function isCurrency(obj: unknown): obj is Currency {
  return (
    (obj || false) &&
    typeof obj === 'object' &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'value' in obj &&
    typeof obj.value === 'number'
  );
}

export function validateCategoriesFromObject(data: any): { errorMessage: string } | { data: Category[] } {
  if (!Array.isArray(data)) {
    return { errorMessage: "'categories' is not an array" };
  }
  for (let i = 0; i < data.length; i++) {
    if (!isCategory(data[i])) {
      return { errorMessage: `${JSON.stringify(data[i])} is not a valid category` };
    }
  }
  return { data: data };
}

export function validateAccountsFromObject(data: any): { errorMessage: string } | { data: Account[] } {
  if (!Array.isArray(data)) {
    return { errorMessage: "'accounts' is not an array" };
  }
  for (let i = 0; i < data.length; i++) {
    if (!isAccount(data[i])) {
      return { errorMessage: `${JSON.stringify(data[i])} is not a valid account` };
    }
  }
  return { data: data };
}

export function validateCurrenciesFromObject(data: any): { errorMessage: string } | { data: Currency[] } {
  if (!Array.isArray(data)) {
    return { errorMessage: "'currencies' is not an array" };
  }
  for (let i = 0; i < data.length; i++) {
    if (!isCurrency(data[i])) {
      return { errorMessage: `${JSON.stringify(data[i])} is not a valid currency` };
    }
  }
  return { data: data };
}

export function validateDefaultAccountIdFromObject(data: any): { errorMessage: string } | { data: number } {
  if (typeof data == 'number') {
    return { data }
  } else {
    return { errorMessage: "not a number" }
  }
}

export function validateDefaultCurrencyIdFromObject(data: any): { errorMessage: string } | { data: number } {
  if (typeof data == 'number') {
    return { data }
  } else {
    return { errorMessage: "not a number" }
  }
}

export function tryParseTextIntoData(stringToImport: string) {
  try {
    let parsedData = JSON.parse(stringToImport)
    if (!("categories" in parsedData && "default_account_id" in parsedData && "default_currency_id" in parsedData && "accounts" in parsedData && "currencies" in parsedData)) {
      return { errorMessage: "data incomplete" }
    }

    const categories = validateCategoriesFromObject(parsedData.categories)
    if ('errorMessage' in categories) {
      return categories
    }
    const default_account_id = validateDefaultAccountIdFromObject(parsedData.default_account_id)
    if ('errorMessage' in default_account_id) {
      return default_account_id
    }
    const default_currency_id = validateDefaultCurrencyIdFromObject(parsedData.default_currency_id)
    if ('errorMessage' in default_currency_id) {
      return default_currency_id
    }
    const accounts = validateAccountsFromObject(parsedData.accounts)
    if ('errorMessage' in accounts) {
      return accounts
    }
    const currencies = validateCurrenciesFromObject(parsedData.currencies)
    if ('errorMessage' in currencies) {
      return currencies
    }
    if (currencies.data.filter(currency => currency.id == default_currency_id.data).length != 1) {
      return { errorMessage: 'invalid relationship between default_currency_id and currencies' }
    }
    if (accounts.data.filter(account => account.id == default_account_id.data).length != 1) {
      return { errorMessage: 'invalid relationship between default_account_id and accounts' }
    }
    return {
      data: {
        categories: categories.data,
        default_account_id: default_account_id.data,
        default_currency_id: default_currency_id.data,
        accounts: accounts.data,
        currencies: currencies.data
      }
    }
  } catch {
    return { errorMessage: "not a json" };
  }
}
</script>

<template>
  <v-card class="pa-4 mb-12">
    <h2>Import from file</h2>
    <v-switch
      v-model="showJsonOnly"
      class="mt-2"
      inset
      label="Only show .json files"
    >
    </v-switch>
    <v-file-input
      v-model="fileData"
      :accept="showJsonOnly ? 'application/json' : ''"
      label="File input"
    ></v-file-input>
    <v-btn
      class="mb-4"
      :disabled="!fileData.length"
      @click="tryImportFromFile()"
      variant="outlined"
    > import from file</v-btn>
  </v-card>
  <v-card class="pa-4">
    <h2>Import from text</h2>
    <v-textarea
      class="mt-4"
      v-model="textFieldData"
    >
    </v-textarea>
    <v-btn
      class="mb-4"
      :disabled="!textFieldData"
      @click="tryImportData(textFieldData)"
      variant="outlined"
    > import from text </v-btn>
  </v-card>
  <div class="text-center ma-2">
    <v-btn @click="isSnackbarDisplayed = true">
      Open Snackbar
    </v-btn>
    <v-snackbar
      :color=snackbarColor
      v-model="isSnackbarDisplayed"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="isSnackbarDisplayed = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
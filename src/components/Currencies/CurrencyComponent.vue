<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()
import TransactionList from '@/components/Transactions/TransactionList.vue'
import type { Currency } from '@/types/types'
import { useCurrenciesStore } from '@/stores/currenciesStore'
import { computed } from 'vue'
import { useAccountsStore } from '@/stores/accountsStore'
const currenciesStore = useCurrenciesStore()
const accountsStore = useAccountsStore()

const props = defineProps<{
  currency: Currency
  showTransactionDialog: Function
}>()

const emit = defineEmits<{
  (e: 'showCurrencyDialog', currency: Currency): void
}>()

const accountIds = computed(() => {
  return currenciesStore.getAccountIdsByCurrency(props.currency)
})

const transactions = computed(() => {
  return categoriesStore.transactions.filter((elem) => accountIds.value.includes(elem.account_id))
})

const balance = computed(() => {
  return transactions.value.reduce((sum, e) => e.amount + sum, 0).toFixed(2)
})
</script>

<template>
  <div
    class="mt-12 mb-1"
    style="font-size: 1.2rem; display: flex; flex-direction: row; justify-content: space-between"
  >
    <div>
      <RouterLink :to="{ name: 'currency', params: { currencyId: currency.id } }" tabindex="0">
        {{ currency.name }}
      </RouterLink>
      <template v-if="currency.api_name != ''"> (api name: {{ currency.api_name }}) </template>
      <template v-if="currency.id != currenciesStore.default_currency_id">
        <template v-if="currency.base_currency_id != currenciesStore.default_currency_id">
          (equal to {{ currency.value_relative_to_default
          }}{{ currenciesStore.getDefaultCurrency().name }},
        </template>
        <template v-else> (</template>

        <template
          v-if="
            !currency.api_name ||
            !currenciesStore.getCurrencyById(currency.base_currency_id)?.api_name
          "
          >defined as {{ currency.value_relative_to_base
          }}{{ currenciesStore.getCurrencyById(currency.base_currency_id)!.name }})
        </template>
        <template v-else
          >updated with api, today: {{ currency.value_relative_to_base
          }}{{ currenciesStore.getCurrencyById(currency.base_currency_id)!.name }})
        </template>
      </template>
    </div>
    <div>
      <button
        @click="$emit('showCurrencyDialog', currency)"
        class="edit-button"
        aria-label="edit currency"
      >
        <v-icon icon="mdi-pencil" style="color: var(--visible-yellow)" />
      </button>
      <button
        @click="currenciesStore.currencies.length != 1 && currenciesStore.deleteCurrency(currency)"
        class="delete-button"
        aria-label="delete currency"
        :disabled="currenciesStore.currencies.length == 1"
      >
        <v-icon
          icon="mdi-delete"
          :style="'color: ' + (currenciesStore.currencies.length != 1 ? 'red' : 'gray')"
        />
      </button>
    </div>
  </div>
  balance:
  {{ balance }}
  <RouterLink
    style="color: var(--color-text)"
    :to="{ name: 'currency', params: { currencyId: currency.id } }"
  >
    {{ currency.name }}
  </RouterLink>
  <br />
  Accounts:
  <span v-for="accountId in accountIds" :key="accountId">
    <RouterLink :to="{ name: 'account', params: { accountId: accountId } }" tabindex="0">
      {{ accountsStore.getAccountById(accountId).name }}
    </RouterLink>
    <span v-if="accountId != accountIds[accountIds.length - 1]">, </span>
  </span>
  <br />
  <!-- <v-btn
    v-if="currenciesStore.default_currency_id == currency.id"
    class="mb-1"
    style="color: green;"
    disabled
  >default currency</v-btn>
  <v-btn
    v-else
    class="mb-1"
    @click="currenciesStore.default_currency_id = currency.id"
  >
    set as default
  </v-btn>
  <br> -->
  <TransactionList :showDialog="showTransactionDialog" :transactions="transactions">
  </TransactionList>
</template>

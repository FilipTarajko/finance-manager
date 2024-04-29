<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore'
import { useCurrenciesStore } from '@/stores/currenciesStore'
import { useAccountsStore } from '@/stores/accountsStore'
import TransactionList from '@/components/Transactions/TransactionList.vue'
import type { Account } from '@/types/types'
import { computed } from 'vue'
const categoriesStore = useCategoriesStore()
const currenciesStore = useCurrenciesStore()
const accountsStore = useAccountsStore()

const props = defineProps<{
  account: Account
  showTransactionDialog: Function
}>()

defineEmits<{
  (e: 'showAccountDialog', account: Account): void
}>()

const transactions = computed(() => {
  return categoriesStore.transactions.filter((elem) => elem.account_id == props.account.id)
})

const balance = computed(() => {
  return transactions.value.reduce((sum, e) => e.amount + sum, 0).toFixed(2)
})

const currency = computed(() => {
  return currenciesStore.getCurrencyByAccount(props.account)
})
</script>

<template>
  <div
    class="mt-12"
    style="font-size: 1.2rem; display: flex; flex-direction: row; justify-content: space-between"
  >
    <div>
      <RouterLink :to="{ name: 'account', params: { accountId: account.id } }">
        {{ account.name }}
      </RouterLink>
      - balance:
      {{ balance }}
      <RouterLink :to="{ name: 'currency', params: { currencyId: currency!.id } }">
        {{ currency!.name }}
      </RouterLink>
    </div>
    <div>
      <button
        class="edit-button"
        @click="$emit('showAccountDialog', account)"
        aria-label="edit account"
        style="color: var(--visible-yellow)"
      >
        <v-icon icon="mdi-pencil" />
      </button>
      <button
        class="delete-button"
        @click="accountsStore.accounts.length != 1 && accountsStore.deleteAccount(account)"
        aria-label="delete account"
        :disabled="accountsStore.accounts.length == 1"
        :style="'color: ' + (accountsStore.accounts.length != 1 ? 'red' : 'gray')"
      >
        <v-icon icon="mdi-delete" />
      </button>
    </div>
  </div>
  <v-btn
    v-if="accountsStore.default_account_id == account.id"
    class="mb-1"
    style="color: green"
    disabled
    >default account</v-btn
  >
  <v-btn v-else class="mb-1" @click="accountsStore.default_account_id = account.id">
    set as default
  </v-btn>
  <br />
  <TransactionList :showDialog="showTransactionDialog" :transactions="transactions">
  </TransactionList>
</template>

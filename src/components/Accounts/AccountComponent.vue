<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import { useAccountsStore } from '@/stores/accountsStore';
import TransactionList from "@/components/Transactions/TransactionList.vue"
import type { Account } from '@/types/types';
import { computed } from 'vue';
const categoriesStore = useCategoriesStore();
const currenciesStore = useCurrenciesStore();
const accountsStore = useAccountsStore();

const props = defineProps<{
  account: Account,
  showTransactionDialog: Function,
  showAccountDialog: Function
}>()

const transactions = computed(() => {
  return categoriesStore.transactions.filter(elem => elem.account_id == props.account.id)
})

const balance = computed(() => {
  return transactions.value.
    reduce((sum, e) => e.amount + sum, 0).toFixed(2)
})
</script>

<template>
  {{ account }}
  <v-icon
    @click="showAccountDialog(account)"
    class="edit-button"
    icon="mdi-pencil"
    aria-label="edit account"
    style="color: yellow"
  />
  <v-icon
    @click="accountsStore.deleteAccount(account)"
    icon="mdi-delete"
    aria-label="delete account"
    style="color: red"
  />
  <br />
  <TransactionList
    :showDialog="showTransactionDialog"
    :transactions="transactions"
  >
  </TransactionList>
  balance:
  {{ balance }}
  {{ currenciesStore.getCurrencyNameByAccount(account) }}
</template>
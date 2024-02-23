<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
// import { useAccountsStore } from '@/stores/accountsStore';
import TransactionList from "@/components/Transactions/TransactionList.vue"
const categoriesStore = useCategoriesStore();
const currenciesStore = useCurrenciesStore();
// const accountsStore = useAccountsStore();

defineProps<{
  account: any,
  showTransactionDialog: Function,
  showAccountDialog: Function
}>()
</script>

<template>
  {{ account }}
  <v-icon
    @click="showAccountDialog(account)"
    class="edit-button"
    icon="mdi-pencil"
    aria-label="edit category"
    style="color: yellow"
  />
  <!-- <v-icon
    @click="accountsStore.deleteAccount(account)"
    icon="mdi-delete"
    aria-label="delete category"
    style="color: red"
  /> -->
  <br />
  <TransactionList
    :showDialog="showTransactionDialog"
    :transactions="categoriesStore.transactions.filter(elem => elem.account_id == account.id)"
  >
  </TransactionList>
  balance:
  {{ categoriesStore.transactions.filter(elem => elem.account_id == account.id).reduce((sum, e) => e.amount + sum,
    0).toFixed(2)
  }}
  {{ currenciesStore.getCurrencyNameByAccount(account) }}
</template>
<script setup lang="ts">
import { useAccountsStore } from '../stores/accountsStore'
import { useCategoriesStore } from '../stores/categoriesStore'
import { useCurrenciesStore } from '../stores/currenciesStore'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const categoriesStore = useCategoriesStore()
const currenciesStore = useCurrenciesStore()
const accountsStore = useAccountsStore()
const route = useRoute()

import { useTransactionFormComposable } from '@/composables/transactionFormComposable'
const { isTransactionDialogShown, dialogTransaction, showTransactionDialog } =
  useTransactionFormComposable()

const transaction = computed(() => {
  return categoriesStore.transactions.find((e) => e.id == (route.params.transactionId as any))
})

const currency = computed(() => {
  return transaction.value && currenciesStore.getCurrencyByTransaction(transaction?.value)
})
</script>

<template>
  <main>
    <h1>Transaction</h1>
    <template v-if="transaction">
      <div style="display: flex; justify-content: space-between; font-size: 1.2rem">
        <h2>
          {{ transaction.name }}
        </h2>
        <div>
          <v-icon
            @click="showTransactionDialog(transaction)"
            class="edit-button"
            icon="mdi-pencil"
            aria-label="edit transaction"
            style="color: var(--visible-yellow)"
          />
          <v-icon
            icon="mdi-delete"
            class="remove-button"
            style="color: red"
            aria-label="delete transaction"
            @click="categoriesStore.deleteTransaction(transaction)"
          ></v-icon>
        </div>
      </div>
      <div
        style="
          display: grid;
          grid-template-columns: auto auto;
          width: fit-content;
          gap: 0.2rem 1rem;
        "
      >
        <div>amount</div>
        <div>
          {{ transaction.amount.toFixed(2) }}
        </div>
        <div>currency</div>
        <div>
          <RouterLink :to="{ name: 'currency', params: { currencyId: currency?.id } }">
            {{ currency?.name }}
          </RouterLink>
        </div>
        <div>category</div>
        <div>
          <RouterLink
            :style="{ color: transaction.categoryData.color }"
            :to="{ name: 'category', params: { categoryId: transaction.categoryData.id } }"
          >
            <v-icon :icon="transaction.categoryData.icon" /> {{ transaction.categoryData.name }}
          </RouterLink>
        </div>
        <div>account</div>
        <RouterLink :to="{ name: 'account', params: { accountId: transaction.account_id } }">
          {{ accountsStore.getAccountById(transaction.account_id).name }}
        </RouterLink>
        <div>date</div>
        <div>
          {{ new Date(transaction.timestamp).toISOString().split('T')[0] }}
        </div>
      </div>
      <TransactionEditDialog
        v-model="isTransactionDialogShown"
        :transaction="dialogTransaction"
      ></TransactionEditDialog>
    </template>
    <template v-else> Transaction not found </template>
  </main>
</template>

<script setup lang="ts">
import { useAccountsStore } from '../stores/accountsStore'
import AccountEditDialog from '@/components/Accounts/AccountEditDialog.vue'
import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import AccountComponent from '@/components/Accounts/AccountComponent.vue'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import type { Account } from '@/types/types'
import { useTransactionFormComposable } from '@/composables/transactionFormComposable'
const accountsStore = useAccountsStore()
const route = useRoute()

const account = computed(() => {
  return accountsStore.getAccountById(route.params.accountId as any)
})

const { isTransactionDialogShown, dialogTransaction, showTransactionDialog } =
  useTransactionFormComposable()

const isAccountDialogShown = ref(false)
const dialogAccount: Ref<Account | null> = ref(null)

function showAccountDialog(account: Account) {
  dialogAccount.value = account
  isAccountDialogShown.value = true
}
</script>

<template>
  <main>
    <h1>Account</h1>
    <template v-if="account">
      <AccountComponent
        :account="account"
        @showTransactionDialog="showTransactionDialog"
        @showAccountDialog="showAccountDialog"
      ></AccountComponent>
      <AccountEditDialog
        v-model="isAccountDialogShown"
        :editedAccount="dialogAccount"
      ></AccountEditDialog>
      <TransactionEditDialog
        v-model="isTransactionDialogShown"
        :transaction="dialogTransaction"
      ></TransactionEditDialog>
    </template>
    <template v-else> Account not found </template>
  </main>
</template>

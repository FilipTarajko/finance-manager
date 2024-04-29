<script setup lang="ts">
import { useAccountsStore } from '@/stores/accountsStore'
import TransactionEditDialog from '@/components/Transactions/TransactionEditDialog.vue'
import AccountComponent from '@/components/Accounts/AccountComponent.vue'
import AccountEditDialog from '@/components/Accounts/AccountEditDialog.vue'
import AccountForm from '@/components/Accounts/AccountForm.vue'
import { ref, type Ref } from 'vue'
import type { Account } from '@/types/types'
import { useTransactionFormComposable } from '@/composables/transactionFormComposable'
const accountsStore = useAccountsStore()

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
    <h1>Accounts</h1>
    <AccountForm></AccountForm>
    <div v-for="account in accountsStore.accounts" :key="account.id">
      <AccountComponent
        :account="account"
        :showTransactionDialog="showTransactionDialog"
        @showAccountDialog="showAccountDialog"
      ></AccountComponent>
    </div>
    <AccountEditDialog
      v-model="isAccountDialogShown"
      :editedAccount="dialogAccount"
    ></AccountEditDialog>
    <TransactionEditDialog
      v-model="isTransactionDialogShown"
      :transaction="dialogTransaction"
    ></TransactionEditDialog>
  </main>
</template>

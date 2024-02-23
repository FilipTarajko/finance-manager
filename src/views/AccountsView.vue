<script setup lang="ts">
import { useAccountsStore } from '@/stores/accountsStore';
import TransactionEditDialog from "@/components/Transactions/TransactionEditDialog.vue"
import AccountComponent from "@/components/Accounts/AccountComponent.vue"
import AccountEditDialog from "@/components/Accounts/AccountEditDialog.vue"
import AccountForm from "@/components/Accounts/AccountForm.vue"
import { ref, type Ref } from 'vue';
import type { Account, TransactionWithCategoryData } from '@/types/types';
const accountsStore = useAccountsStore();

let isAccountDialogShown = ref(false)
let dialogAccount: Ref<Account | null> = ref(null)

function showAccountDialog(account: Account) {
  dialogAccount.value = account
  isAccountDialogShown.value = true
}

let isTransactionDialogShown = ref(false)
let dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

function showTransactionDialog(transaction: TransactionWithCategoryData) {
  dialogTransaction.value = transaction
  isTransactionDialogShown.value = true
}
</script>

<template>
  <h1>Accounts</h1>
  <AccountForm></AccountForm>
  <ul>
    <li
      v-for="account in accountsStore.accounts"
      :key="account.id"
    >
      <AccountComponent
        :account="account"
        :showTransactionDialog="showTransactionDialog"
        :showAccountDialog="showAccountDialog"
      ></AccountComponent>
    </li>
  </ul>
  <AccountEditDialog
    v-model=isAccountDialogShown
    :editedAccount="dialogAccount"
  ></AccountEditDialog>
  <TransactionEditDialog
    v-model=isTransactionDialogShown
    :transaction="dialogTransaction"
  ></TransactionEditDialog>
</template>
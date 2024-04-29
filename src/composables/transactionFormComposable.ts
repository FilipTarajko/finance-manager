import { ref, type Ref } from 'vue'
import type { TransactionWithCategoryData } from '@/types/types'

export function useTransactionFormComposable() {
  const isTransactionDialogShown = ref(false)
  const dialogTransaction: Ref<TransactionWithCategoryData | null> = ref(null)

  function showTransactionDialog(transaction: TransactionWithCategoryData) {
    dialogTransaction.value = transaction
    isTransactionDialogShown.value = true
  }

  return { isTransactionDialogShown, dialogTransaction, showTransactionDialog }
}

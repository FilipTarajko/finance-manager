import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transactionStore', () => {
  const transactions = ref([{
    id: 1,
    name: "Dinner",
    amount: -20
  }, {
    id: 2,
    name: "Scholarship",
    amount: 1000
  }, {
    id: 3,
    name: "Groceries",
    amount: 60.53
  }]);

  const positiveTransactions = computed(() => transactions.value.filter((elem) => elem.amount>0))

  const negativeTransactions = computed(() => transactions.value.filter((elem) => elem.amount<0))

  function addTransaction(name: string, amount: number) {
    let nextId = 0;
    for (const elem of transactions.value){
      if (nextId<elem.id){
        nextId = elem.id+1;
      }
    }
    transactions.value.push({
      id: nextId,
      name,
      amount
    })
  }

  return { transactions, positiveTransactions, negativeTransactions, addTransaction }
})

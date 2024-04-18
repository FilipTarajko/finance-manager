<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useCurrenciesStore } from '@/stores/currenciesStore';
import type { TransactionWithCategoryData } from '@/types/types'

defineProps<{
  transaction: TransactionWithCategoryData,
  showDialog: Function
}>()

const categoriesStore = useCategoriesStore();
const currenciesStore = useCurrenciesStore();

</script>


<template>
  <div style="display: flex; flex-direction: row; flex-wrap: wrap;">
    <div id="name">
      <RouterLink :to="{ name: 'transaction', params: { transactionId: transaction.id } }">
        {{ transaction.name }}
      </RouterLink>
    </div>
    <div id="amount" style="margin-right: 1ch; text-align: right;">
      {{ transaction.amount.toFixed(2) }}
    </div>
    <div id="currency">
      {{ currenciesStore.getCurrencyNameByTransaction(transaction) }}
    </div>
    <div id="category" :style="{ color: transaction.categoryData.color }">
      <v-icon :icon="transaction.categoryData.icon" /> {{ transaction.categoryData.name }}
    </div>
    <div id="icons">
      <v-icon @click="showDialog(transaction)" class="edit-button" icon="mdi-pencil" aria-label="edit transaction"
        style="color: var(--visible-yellow)" />
      <v-icon icon="mdi-delete" class="remove-button" style="color: red" aria-label="delete transaction"
        @click="categoriesStore.deleteTransaction(transaction)"></v-icon>
    </div>
  </div>
</template>

<style scoped>
div {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

#name {
  order: 1;
  width: 24%;
}

#amount {
  order: 2;
  width: 24%;
}

#currency {
  order: 3;
  width: 13%;
}

#category {
  order: 4;
  width: calc(37% - 6.2ch);
}

#icons {
  order: 5;
  width: 6ch;
}

@media (max-width: 500px) {
  div {
    font-size: 12px;
  }

  #name {
    width: 45%;
  }

  #amount {
    width: 50%;
    order: 6;
  }

  #currency {
    width: 46%;
    order: 7;
  }

  #category {
    width: calc(55% - 6ch);
  }

  #icons {
    width: 6ch;
  }
}
</style>
<script setup lang="ts">
  import { ref } from 'vue'

  let transactions = ref([{
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
</script>

<template>
  <main>
  <h1>Transactions</h1>
  <ul>
    <li v-for="transaction of transactions" :key="transaction.id">
      {{ transaction.id }} - {{ transaction.name }}: {{ transaction.amount }}
    </li>
  </ul>  
  </main>
</template>

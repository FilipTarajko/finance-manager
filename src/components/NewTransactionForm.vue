<script setup lang="ts">
import { ref } from 'vue'
import { useTransactionStore } from '../stores/transactionStore'
const transactionsStore = useTransactionStore()

const name = ref('')
const amount = ref(0)
</script>

<template>
    <h2>new transaction</h2>
    <form class="form" @submit.prevent="transactionsStore.addTransaction(name, amount)">
        <input type="text" v-model="name" />
        <input type="number" step="0.01" v-model="amount" />
        <button>add</button>
    </form>
</template>

<style lang="scss">
.form {
    display: flex;
    flex-direction: column;
    width: 10rem;
}
</style>

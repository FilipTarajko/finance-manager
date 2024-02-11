<script setup lang="ts">
import { ref } from "vue";
import { useTransactionStore } from '@/stores/transactionStore'
const transactionsStore = useTransactionStore()

const filename = ref("testFileName.txt");

function getLocale() {
    if (navigator.languages != undefined) {
        return navigator.languages[0];
    }
    return navigator.language;
}

function exportData() {
    let text = JSON.stringify(transactionsStore.transactions);
    let filename = "exported data " + new Date().toLocaleString(getLocale()) + ".txt";

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
</script>

<template>
    <h1>Export</h1>
    <button @click="exportData">export data</button>
</template>
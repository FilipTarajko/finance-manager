import { setActivePinia, createPinia } from "pinia";
import { useTransactionStore } from "../transactionStore";
import { describe, beforeEach, it, expect } from "vitest";
import { createApp } from "vue";

describe("transactionStore", () => {
    const app = createApp({});
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it('adds new transactions', () => {
        const transactionsStore = useTransactionStore();
        transactionsStore.addTransaction("test transaction", -12.34);
        let lastElement = transactionsStore.transactions[transactionsStore.transactions.length - 1];
        expect(lastElement.name).toEqual("test transaction");
        expect(lastElement.amount).toEqual(-12.34);
    })
})
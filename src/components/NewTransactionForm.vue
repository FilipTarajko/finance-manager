<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength } from '@vuelidate/validators'

import { useTransactionsStore } from '../stores/transactionsStore'
import { useCategoriesStore } from '../stores/categoriesStore'
const transactionsStore = useTransactionsStore()
const categoriesStore = useCategoriesStore()

const initialState = {
  name: '',
  amount: 0,
  category: null
}

const state = reactive({
  name: initialState.name,
  amount: initialState.amount,
  category: initialState.category
})

const rules = {
  name: { required, maxLength: maxLength(20) },
  amount: { required },
  category: { required },
}

const categoryOptions = computed(() => {
  return categoriesStore.categories.map((elem) => {
    return {
      title: elem.name,
      value: elem
    }
  })
})

const v$ = useVuelidate(rules, state)

function clear() {
  v$.value.$reset()

  for (const [key, value] of Object.entries(initialState)) {
    // @ts-ignore
    state[key] = value
  }
}

function addTransaction() {
  v$.value.$validate()
  if (v$.value.$error || !state.category) {
    return;
  }
  transactionsStore.addTransaction(state.name, state.amount, state.category)
}
</script>


<template>
  <h2>new transaction</h2>
  <form class="mb-4" style="width: 24rem;">
    <v-text-field v-model="state.name" label="Name" required @input="v$.name.$touch" @blur="v$.name.$touch"
      :error-messages="(v$.name.$errors.map(e => e.$message) as string[])" class="mb-1">
    </v-text-field>

    <v-text-field type="number" v-model.number="state.amount" label="Amount" required @input="v$.amount.$touch"
      @blur="v$.amount.$touch" :error-messages="(v$.amount.$errors.map(e => e.$message) as string[])"
      class="mb-1"></v-text-field>

    <v-select v-model="state.category" :items="categoryOptions" label="Item" required @change="v$.category.$touch"
      @blur="v$.category.$touch" :error-messages="(v$.category.$errors.map(e => e.$message) as string[])" class="mb-2">
    </v-select>

    <v-btn class="me-4" @click="addTransaction" color="success">
      submit
    </v-btn>
    <v-btn @click="clear" color="error">
      clear
    </v-btn>
  </form>
</template>

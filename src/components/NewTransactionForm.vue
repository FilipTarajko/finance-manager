<script setup lang="ts">
import { reactive, ref, type Ref } from 'vue'
import { useTransactionsStore } from '../stores/transactionsStore'
const transactionsStore = useTransactionsStore()
import { useCategoriesStore } from '../stores/categoriesStore'
import type { Category } from '@/types/types'
const categoriesStore = useCategoriesStore()
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

// const name = ref('')
// const amount = ref(0)
// const category: Ref<null | Category> = ref(null)

function addTransaction() {
  if (!state?.category) {
    return
  } else {
    transactionsStore.addTransaction(state.name, state.amount, state.category)
  }
}

const initialState = {
  name: '',
  amount: 0,
  category: null
}

const state = reactive({
  name: '',
  amount: 0,
  category: null
})

const rules = {
  name: { required },
  amount: { required },
  category: { required },
}

const v$ = useVuelidate(rules, state)

function clear() {
  v$.value.$reset()

  for (const [key, value] of Object.entries(initialState)) {
    // @ts-ignore
    state[key] = value
  }
}
</script>


<template>
  <form>
    <!-- :error-messages="v$.name.$errors.map(e => e.$message)" -->
    <v-text-field v-model="state.name" :counter="10" label="Name" required @input="v$.name.$touch"
      @blur="v$.name.$touch"></v-text-field>

    <!-- :error-messages="v$.amount.$errors.map(e => e.$message)"  -->
    <v-text-field v-model="state.amount" label="Amount" required @input="v$.amount.$touch"
      @blur="v$.amount.$touch"></v-text-field>

    <!-- :error-messages="v$.category.$errors.map(e => e.$message)" -->
    <v-select v-model="state.category" :items="categoriesStore.categories" label="Item" required
      @change="v$.category.$touch" @blur="v$.category.$touch"></v-select>

    <v-btn class="me-4" @click="v$.$validate">
      submit
    </v-btn>
    <v-btn @click="clear">
      clear
    </v-btn>
  </form>
  <!-- <div :class="{ error: v$.name.$errors.length }">
    <input v-model="state.name">
    <div class="input-errors" v-for="error of v$.firstName.$errors" :key="error.$uid">
      <div class="error-msg">{{ error.$message }}</div>
    </div>
  </div> -->
</template>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  width: 10rem;
}
</style>

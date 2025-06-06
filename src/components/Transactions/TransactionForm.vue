<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'

import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

import { useAccountsStore } from '@/stores/accountsStore'
const accountsStore = useAccountsStore()

import { useCurrenciesStore } from '@/stores/currenciesStore'
import type { TransactionWithCategoryData } from '@/types/types'
const currenciesStore = useCurrenciesStore()

const props = defineProps<{
  transaction?: TransactionWithCategoryData | null
}>()

const emit = defineEmits<{
  (e: 'hideTransactionDialog'): void
}>()

const isEditing = computed(() => {
  return !!props?.transaction?.name
})

const initialState = {
  name: props?.transaction?.name ?? '',
  amount: props?.transaction?.amount ?? null,
  category: categoriesStore.tryGetCategoryByName(props?.transaction?.categoryData?.name!) ?? null,
  account_id: props?.transaction?.account_id ?? accountsStore.default_account_id,
  timestamp: (props?.transaction?.timestamp ? new Date(props?.transaction?.timestamp) : new Date()).toISOString().slice(0, 10),
}

const state = reactive({
  name: initialState.name,
  amount: initialState.amount,
  category: initialState.category,
  account_id: initialState.account_id,
  timestamp: initialState.timestamp,
})

const mustHaveAtMost2DecimalDigits = (value: number) => {
  return value == Math.round(value * 100) / 100
}
const mustNotBeEqualToZero = (value: number) => {
  return value != 0
}

const rules = {
  name: { required, maxLength: maxLength(20) },
  amount: {
    required,
    mustNotBeEqualToZero: helpers.withMessage('Must not be equal to 0', mustNotBeEqualToZero),
    mustHaveAtMost2DecimalDigits: helpers.withMessage(
      'Must have at most 2 decimal digits',
      mustHaveAtMost2DecimalDigits
    )
  },
  category: { required },
  account_id: { required },
  timestamp: { required },
}

const categoryOptions = computed(() => {
  return categoriesStore.categories.map((elem) => {
    return {
      title: elem.name,
      value: elem
    }
  })
})

const accountOptions = computed(() => {
  return accountsStore.accounts.map((acc) => {
    return {
      title: acc.name + ' (' + currenciesStore.getCurrencyNameByAccount(acc) + ')',
      value: acc.id
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

function editOrCreateAndAddTransaction() {
  v$.value.$validate()
  if (v$.value.$error || !state.category) {
    return
  }

  const timestamp = Math.floor(new Date(state.timestamp).getTime() / 86400000) * 86400000;

  if (isEditing.value) {
    categoriesStore.editExistingTransaction(props.transaction!, { ...state, timestamp })
    emit('hideTransactionDialog')
  } else {
    categoriesStore.createAndAddTransaction(
      state.name,
      state.amount!,
      state.category,
      state.account_id,
      timestamp,
    )
  }
}
</script>

<template>
  <h2>{{ isEditing ? 'edit transaction: ' + props.transaction!.name : 'new transaction' }}</h2>
  <form
    v-if="categoriesStore.categories.length"
    class="mb-4"
    style="width: 24rem"
    @submit.prevent="editOrCreateAndAddTransaction"
  >
    <v-text-field
      v-model="state.name"
      label="Name"
      required
      @input="v$.name.$touch"
      @blur="v$.name.$touch"
      :error-messages="v$.name.$errors.map((e) => e.$message) as string[]"
      class="mb-1"
    >
    </v-text-field>

    <v-text-field
      type="number"
      step="0.01"
      v-model.number="state.amount"
      label="Amount"
      required
      @input="v$.amount.$touch"
      @blur="v$.amount.$touch"
      :error-messages="v$.amount.$errors.map((e) => e.$message) as string[]"
      class="mb-1"
    ></v-text-field>

    <v-select
      v-model="state.category"
      :items="categoryOptions"
      label="Category"
      required
      @change="v$.category.$touch"
      @blur="v$.category.$touch"
      :error-messages="v$.category.$errors.map((e) => e.$message) as string[]"
      class="mb-2"
    >
    </v-select>

    <v-select
      v-model="state.account_id"
      :items="accountOptions"
      label="Account"
      required
      @change="v$.account_id.$touch"
      @blur="v$.account_id.$touch"
      :error-messages="v$.account_id.$errors.map((e) => e.$message) as string[]"
      class="mb-2"
    >
    </v-select>

    <v-text-field
        v-model="state.timestamp"
        type="date"
        label="timestamp"
        @change="v$.timestamp.$touch"
        @blur="v$.timestamp.$touch"
        :error-messages="v$.timestamp.$errors.map((e) => e.$message) as string[]"
        class="mb-2"
      >
    </v-text-field>

    <v-btn class="me-4" type="submit" color="success">
      {{ isEditing ? 'update' : 'add' }}
    </v-btn>
    <v-btn class="me-4" @click="clear" color="error" theme="light"> reset </v-btn>
    <v-btn v-if="isEditing" @click="$emit('hideTransactionDialog')" color="warning">
      cancel & exit
    </v-btn>
  </form>
  <template v-else>
    There are no
    <RouterLink :to="{ name: 'categories' }" tabindex="0">categories</RouterLink>, so transactions
    can't be created.
  </template>
</template>

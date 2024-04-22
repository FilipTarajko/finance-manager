<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'

import { useAccountsStore } from '@/stores/accountsStore'
const accountsStore = useAccountsStore()

import { useCurrenciesStore } from '@/stores/currenciesStore'
const currenciesStore = useCurrenciesStore()

const props = defineProps(['account', 'hideDialog'])

const isEditing = computed(() => {
  return !!props?.account?.name
})

const initialState = {
  name: props?.account?.name ?? '',
  currency_id: props?.account?.currency_id ?? currenciesStore.default_currency_id
}

const state = reactive({
  name: initialState.name,
  currency_id: initialState.currency_id
})


const mustBeUniqueAccountName = (value: string) =>
  !accountsStore.accounts.map((elem) => elem.name).includes(value) ||
  accountsStore.accounts.includes(props?.account)

const rules = {
  name: {
    required,
    maxLength: maxLength(20),
    mustBeUniqueAccountName: helpers.withMessage('Must be unique', mustBeUniqueAccountName)
  },
  currency_id: { required }
}

const currencyOptions = computed(() => {
  return currenciesStore.currencies.map((elem) => {
    return {
      title: elem.name,
      value: elem.id
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

function editOrCreateAndAddAccount() {
  v$.value.$validate()
  if (v$.value.$error) {
    return
  }
  if (isEditing.value) {
    accountsStore.editExistingAccount(props.account, state)
    props.hideDialog()
  } else {
    accountsStore.createAndAddAccount(state.name, state.currency_id)
  }
}
</script>

<template>
  <h2>{{ isEditing ? 'edit account: ' + props.account.name : 'new account' }}</h2>
  <form
    v-if="currenciesStore.currencies.length"
    class="mb-4"
    style="width: 24rem"
    @submit.prevent="editOrCreateAndAddAccount"
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

    <v-select
      v-model="state.currency_id"
      :items="currencyOptions"
      label="Currency"
      required
      @change="v$.currency_id.$touch"
      @blur="v$.currency_id.$touch"
      :error-messages="v$.currency_id.$errors.map((e) => e.$message) as string[]"
      class="mb-2"
    >
    </v-select>

    <v-btn
      class="me-4"
      color="success"
      type="submit"
    >
      {{ isEditing ? 'update' : 'add' }}
    </v-btn>
    <v-btn
      class="me-4"
      @click="clear"
      color="error"
      theme="light"
    > reset </v-btn>
    <v-btn
      v-if="isEditing"
      @click="hideDialog"
      color="warning"
    > cancel & exit </v-btn>
  </form>
  <template v-else>
    There are no
    <RouterLink :to="{ name: 'currency' }">currencies</RouterLink>,
    so account can't be created.
  </template>
</template>
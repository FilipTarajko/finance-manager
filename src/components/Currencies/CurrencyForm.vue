<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'

import { useCurrenciesStore } from '@/stores/currenciesStore'
const currenciesStore = useCurrenciesStore()

import { useAccountsStore } from '@/stores/accountsStore'
const accountsStore = useAccountsStore()

const props = defineProps(['currency', 'hideDialog'])

const isEditing = computed(() => {
  return !!props?.currency?.name
})

const initialState = {
  name: props?.currency?.name ?? '',
  value: props?.currency?.value ?? 0,
  create_account: false
}

const state = reactive({
  name: initialState.name,
  value: initialState.value,
  create_account: initialState.create_account
})

const mustBeUniqueCurrencyName = (value: string) =>
  !currenciesStore.currencies.map((elem) => elem.name).includes(value) ||
  currenciesStore.currencies.includes(props?.currency)

const canCreateAccountOfThisName = (value: string) => {
  return !state.create_account || !accountsStore.accounts.map((acc) => acc.name).includes(value)
}

const rules = {
  name: {
    required,
    maxLength: maxLength(20),
    mustBeUniqueCurrencyName: helpers.withMessage('Must be unique', mustBeUniqueCurrencyName),
    mustBeUniqueAccountName: helpers.withMessage('There is already an account of this name', canCreateAccountOfThisName)
  },
  value: { required }
}

const v$ = useVuelidate(rules, state)

function clear() {
  v$.value.$reset()

  for (const [key, value] of Object.entries(initialState)) {
    // @ts-ignore
    state[key] = value
  }
}

function editOrCreateAndAddCurrency() {
  v$.value.$validate()
  if (v$.value.$error) {
    return
  }
  if (isEditing.value) {
    currenciesStore.editExistingCurrency(props.currency, state)
    props.hideDialog()
  } else {
    currenciesStore.createAndAddCurrency(state.name, state.value, state.create_account)
  }
}
</script>

<template>
  <h2>{{ isEditing ? 'edit currency: ' + props.currency.name : 'new currency' }}</h2>
  <form
    class="mb-4"
    style="width: 24rem"
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
      v-model.number="state.value"
      type="number"
      label="Value"
      required
      @input="v$.value.$touch"
      @blur="v$.value.$touch"
      :error-messages="v$.value.$errors.map((e) => e.$message) as string[]"
      class="mb-2"
    >
    </v-text-field>

    <v-switch
      v-if="!isEditing"
      style="margin-top: -1rem;"
      @change="v$.name.$touch"
      v-model="state.create_account"
      label="Also create account of the same name"
    >
    </v-switch>

    <v-btn
      class="me-4"
      @click="editOrCreateAndAddCurrency"
      color="success"
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
</template>
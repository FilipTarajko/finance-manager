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
  value_relative_to_base: props?.currency?.value_relative_to_base ?? 0,
  base_currency_id: props?.currency?.base_currency_id ?? currenciesStore.default_currency_id,
  create_account: false,
  api_name: props?.currency?.api_name ?? ""
}

const state = reactive({
  name: initialState.name,
  value_relative_to_base: initialState.value_relative_to_base,
  base_currency_id: initialState.base_currency_id,
  create_account: initialState.create_account,
  api_name: initialState.api_name
})

const mustBeUniqueCurrencyName = (value: string) =>
  !currenciesStore.currencies.map((elem) => elem.name).includes(value) ||
  currenciesStore.currencies.includes(props?.currency)

const mustBeSupportedByApiOrEmpty = (value: string) => {
  const value_uppercased = value.toUpperCase()
  return currenciesStore.currenciesSupportedByApi.includes(value_uppercased) || value === ""
}

const canCreateAccountOfThisName = (value: string) => {
  return !state.create_account || !accountsStore.accounts.map((acc) => acc.name).includes(value)
}

const mustBeExistingCurrencyId = (value: number) =>
  currenciesStore.currencies.filter(currency => currency.id == value).length === 1

const rules = {
  name: {
    required,
    maxLength: maxLength(20),
    mustBeUniqueCurrencyName: helpers.withMessage('Must be unique', mustBeUniqueCurrencyName),
    mustBeUniqueAccountName: helpers.withMessage('There is already an account of this name', canCreateAccountOfThisName)
  },
  base_currency_id: {
    required,
    mustBeExistingCurrencyId: helpers.withMessage('Base currency must exist', mustBeExistingCurrencyId)
  },
  value_relative_to_base: { required },
  api_name: {
    mustBeSupportedByApiOrEmpty: helpers.withMessage("Must be supported by API or empty", mustBeSupportedByApiOrEmpty)
  }
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
    currenciesStore.createAndAddCurrency(state.name, state.base_currency_id, state.value_relative_to_base, state.create_account, state.api_name)
  }
}

const baseCurrencyOptions = computed(() => {
  return currenciesStore.currencies.map((currency) => {
    return {
      title: currency.name,
      value: currency.id
    }
  })
})
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
      v-model.uppercased="state.api_name"
      label="API name (optional)"
      required
      @input="v$.api_name.$touch"
      @blur="v$.api_name.$touch"
      :error-messages="v$.api_name.$errors.map((e) => e.$message) as string[]"
      class="mb-1"
    >
    </v-text-field>
    <v-text-field
      v-model.number="state.value_relative_to_base"
      type="number"
      :label="'Current value (in ' + currenciesStore.currencies.find(e => e.id == state.base_currency_id)!.name + ')'"
      required
      :disabled="props?.currency?.id == currenciesStore.default_currency_id"
      @input="v$.value_relative_to_base.$touch"
      @blur="v$.value_relative_to_base.$touch"
      :error-messages="v$.value_relative_to_base.$errors.map((e) => e.$message) as string[]"
      class="mb-2"
    >
    </v-text-field>
    <v-select
      v-model="state.base_currency_id"
      :items="baseCurrencyOptions"
      label="Based on currency"
      required
      :disabled="props?.currency?.id == currenciesStore.default_currency_id"
      @change="v$.base_currency_id.$touch"
      @blur="v$.base_currency_id.$touch"
      :error-messages="v$.base_currency_id.$errors.map((e) => e.$message) as string[]"
      class="mb-2"
    >
    </v-select>

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
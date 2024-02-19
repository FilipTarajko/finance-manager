<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'

import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

const props = defineProps(['transaction', 'hideDialog'])

const isEditing = computed(() => {
  return !!props?.transaction?.name
})

const initialState = {
  name: props?.transaction?.name ?? '',
  amount: props?.transaction?.amount ?? null,
  category: categoriesStore.tryGetCategoryByName(props?.transaction?.categoryData?.name) ?? null
}

const state = reactive({
  name: initialState.name,
  amount: initialState.amount,
  category: initialState.category
})

const mustHaveAtMost2DecimalDigits = (value: number) => { return value == Math.round(value * 100) / 100 }
const mustNotBeEqualToZero = (value: number) => { return value != 0 }

const rules = {
  name: { required, maxLength: maxLength(20) },
  amount: {
    required,
    mustNotBeEqualToZero: helpers.withMessage("Must not be equal to 0", mustNotBeEqualToZero),
    mustBeUniqueCategoryName: helpers.withMessage('Must have at most 2 decimal digits', mustHaveAtMost2DecimalDigits)
  },
  category: { required }
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

function editOrCreateAndAddTransaction() {
  v$.value.$validate()
  if (v$.value.$error || !state.category) {
    return
  }
  if (isEditing.value) {
    categoriesStore.editExistingTransaction(props.transaction, state)
    props.hideDialog()
  } else {
    categoriesStore.createAndAddTransaction(state.name, state.amount, state.category)
  }
}
</script>

<template>
  <h2>{{ isEditing ? 'edit transaction: ' + props.transaction.name : 'new transaction' }}</h2>
  <form
    v-if="categoriesStore.categories.length"
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
      type="number"
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
      label="Item"
      required
      @change="v$.category.$touch"
      @blur="v$.category.$touch"
      :error-messages="v$.category.$errors.map((e) => e.$message) as string[]"
      class="mb-2"
    >
    </v-select>

    <v-btn
      class="me-4"
      @click="editOrCreateAndAddTransaction"
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
  <template v-else>
    There are no
    <RouterLink :to="{ name: 'categories' }">categories</RouterLink>,
    so transactions can't be created.
  </template>
</template>
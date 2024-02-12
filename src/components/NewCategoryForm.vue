<script setup lang="ts">
import { reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'

import { useCategoriesStore } from '../stores/categoriesStore'
import { helper } from 'echarts';
const categoriesStore = useCategoriesStore()

const icons = [
  "mdi-help",
  "mdi-silverware-variant",
  "mdi-school",
  "mdi-shopping",
  "mdi-train-car",
  "mdi-beach",
  "mdi-gift",
  "mdi-leaf",
  "mdi-movie",
  "mdi-fuel",
  "mdi-home",

]

const initialState = {
  name: '',
  color: '#ff6600',
  iconIndex: 0
}
const state = reactive({
  name: initialState.name,
  color: initialState.color,
  iconIndex: initialState.iconIndex
})

const mustBeUniqueCategoryName = (value: string) =>
  !categoriesStore.categories.map(elem => elem.name).includes(value)


const rules = {
  name: {
    required,
    maxLength: maxLength(14),
    mustBeUniqueCategoryName: helpers.withMessage(
      'Must be unique',
      mustBeUniqueCategoryName
    )
  },
  color: { required },
  iconIndex: { required },
}

const v$ = useVuelidate(rules, state)

function clear() {
  v$.value.$reset()

  for (const [key, value] of Object.entries(initialState)) {
    // @ts-ignore
    state[key] = value
  }
}

function addCategory() {
  v$.value.$validate()
  if (v$.value.$error) {
    return;
  }
  categoriesStore.addCategory(state.name, state.color, icons[state.iconIndex])
}
</script>

<template>
  <h2>new category</h2>
  <form class="mb-4" style="width: 24rem;">
    <v-text-field v-model="state.name" label="Name" required @input="v$.name.$touch" @blur="v$.name.$touch"
      :error-messages="(v$.name.$errors.map(e => e.$message) as string[])" class="mb-1">
    </v-text-field>

    <v-label>Color</v-label>
    <v-color-picker mode="hex" hide-inputs v-model="state.color" label="Color" required @input="v$.color.$touch"
      @blur="v$.color.$touch" :error-messages="(v$.color.$errors.map(e => e.$message) as string[])"
      class="mb-4"></v-color-picker>

    <v-label>Icon</v-label>
    <v-btn-toggle v-model="state.iconIndex" class="mb-2" shaped mandatory>
      <v-btn size="35" v-for="icon in icons"
        :style="'background-color: ' + (icon == icons[state.iconIndex] ? '#888;' : '#444')">
        <v-icon size="25" :color="state.color">{{ icon }}</v-icon>
      </v-btn>
    </v-btn-toggle>
    <br>
    <v-btn class="me-4" @click="addCategory" color="success">
      submit
    </v-btn>
    <v-btn @click="clear" color="error">
      clear
    </v-btn>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength, helpers } from '@vuelidate/validators'
import type { Category } from '@/types/types'

import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

const props = defineProps<{
  category?: Category
}>()

const emit = defineEmits<{
  (e: 'hideDialog'): void
}>()

const isEditing = computed(() => {
  return !!props?.category?.name
})

const icons = [
  'mdi-help',
  'mdi-silverware-variant',
  'mdi-school',
  'mdi-shopping',
  'mdi-train-car',
  'mdi-beach',
  'mdi-gift',
  'mdi-leaf',
  'mdi-movie',
  'mdi-fuel',
  'mdi-home'
]

const initialState = {
  name: props?.category?.name ?? '',
  color: props?.category?.color ?? '#ff6600',
  iconIndex: props?.category?.icon ? icons.indexOf(props?.category?.icon) : 0
}
const state = reactive({
  name: initialState.name,
  color: initialState.color,
  iconIndex: initialState.iconIndex
})

const mustBeUniqueCategoryName = (value: string) =>
  !categoriesStore.categories.map((elem) => elem.name).includes(value) ||
  categoriesStore.categories.includes(props?.category!)

const rules = {
  name: {
    required,
    maxLength: maxLength(20),
    mustBeUniqueCategoryName: helpers.withMessage('Must be unique', mustBeUniqueCategoryName)
  },
  color: { required },
  iconIndex: { required }
}

const v$ = useVuelidate(rules, state)

function clear() {
  v$.value.$reset()

  for (const [key, value] of Object.entries(initialState)) {
    // @ts-ignore
    state[key] = value
  }
}

function editOrCreateAndAddCategory() {
  v$.value.$validate()
  if (v$.value.$error) {
    return
  }
  if (isEditing.value) {
    categoriesStore.editExistingCategory(props.category!, {
      name: state.name,
      color: state.color,
      icon: icons[state.iconIndex]
    })
    emit('hideDialog')
  } else {
    categoriesStore.createAndAddCategory(state.name, state.color, icons[state.iconIndex])
  }
}
</script>

<template>
  <h2>{{ isEditing ? 'edit category: ' + props?.category?.name : 'new category' }}</h2>
  <form class="mb-4" style="width: 24.1rem" @submit.prevent="editOrCreateAndAddCategory">
    <v-text-field
      :id="isEditing ? 'editedCategoryNameTextField' : 'newCategoryNameTextField'"
      v-model="state.name"
      label="Name"
      required
      @input="v$.name.$touch"
      @blur="v$.name.$touch"
      :error-messages="v$.name.$errors.map((e) => e.$message) as string[]"
      class="mb-1"
    >
    </v-text-field>

    <v-label>Color</v-label>
    <v-color-picker
      hide-inputs
      mode="hex"
      v-model="state.color"
      label="Color"
      required
      @input="v$.color.$touch"
      @blur="v$.color.$touch"
      :error-messages="v$.color.$errors.map((e) => e.$message) as string[]"
      class="mb-4"
    ></v-color-picker>

    <v-label>Icon</v-label>
    <br />
    <v-btn-toggle
      v-model="state.iconIndex"
      class="mb-2"
      shaped
      mandatory
      style="display: flex; flex-wrap: wrap; justify-content: start; height: auto"
    >
      <v-btn
        size="35"
        v-for="icon in icons"
        :key="icon"
        :aria-label="'select icon: ' + icon.split('mdi-')[1].replace('-', ' ')"
      >
        <v-icon size="25" :color="state.color">{{ icon }}</v-icon>
      </v-btn>
    </v-btn-toggle>
    <br />
    <v-btn class="me-4" type="submit" color="success">
      {{ isEditing ? 'update' : 'add' }}
    </v-btn>
    <v-btn class="me-4" theme="light" @click="clear" color="error"> clear </v-btn>
    <v-btn v-if="isEditing" @click="$emit('hideDialog')" color="warning"> cancel & exit </v-btn>
  </form>
</template>

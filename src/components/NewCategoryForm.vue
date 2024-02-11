<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useCategoriesStore } from '../stores/categoriesStore'
const categoriesStore = useCategoriesStore()

const name = ref('')
const color = ref('')
const icon = ref('')

function addCategory() {
  categoriesStore.addCategory(name.value, color.value, icon.value)
}
</script>

<template>
  <h2>new category</h2>
  <form class="form" @submit.prevent="addCategory">
    <input type="text" v-model="name" />
    <input type="color" v-model="color" />
    <button>add</button>
  </form>
</template>

<style lang="scss">
.form {
  display: flex;
  flex-direction: column;
  width: 10rem;
}
</style>

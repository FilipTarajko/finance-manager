<script setup lang="ts">
import { useCategoriesStore } from '@/stores/categoriesStore';

defineProps(['item', 'showDialog'])
const categoriesStore = useCategoriesStore();

</script>


<template>
  <RouterLink :to="'/transactions/' + item.id">
    {{ item.name }}
  </RouterLink>
  : {{ item.amount.toFixed(2) }} (
  <span :style="{ color: item.categoryData.color }">
    <v-icon :icon="item.categoryData.icon" />{{ item.categoryData.name }} </span>)
  <v-icon
    @click="showDialog(item)"
    class="edit-button"
    icon="mdi-pencil"
    aria-label="edit transaction"
    style="color: yellow"
  />
  <v-icon
    icon="mdi-delete"
    class="remove-button"
    style="color: red"
    aria-label="delete transaction"
    @click="categoriesStore.deleteTransaction(item)"
  ></v-icon>
</template>
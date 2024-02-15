<script setup lang="ts">
defineProps(['category', 'showDialog'])
</script>


<template>
  <RouterLink :to="'/categories/' + category.id">{{ category.name }}</RouterLink>
  <v-icon
    :icon="category.icon"
    :color="category.color"
  />
  <v-icon
    @click="showDialog(category)"
    class="edit-button"
    icon="mdi-pencil"
    aria-label="edit category"
    style="color: yellow"
  />
</template>
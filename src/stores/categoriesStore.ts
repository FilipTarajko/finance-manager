import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { type Category } from '../types/types'
import { useStorage } from '@vueuse/core'

export const useCategoriesStore = defineStore('categoriesStore', () => {
  const categories: Ref<Category[]> = useStorage('categories', [
    {
      id: 1,
      name: 'Food',
      color: '#abffcc',
      icon: 'food'
    },
    {
      id: 2,
      name: 'Education',
      color: '#ddddaa',
      icon: 'school'
    },
    {
      id: 3,
      name: 'Groceries',
      color: '#ffaabb',
      icon: 'shopping'
    }
  ])

  function addCategory(name: string, color: string, icon: string) {
    let nextId = 0
    for (const elem of categories.value) {
      if (nextId <= elem.id) {
        nextId = elem.id + 1
      }
    }
    categories.value.push({
      id: nextId,
      name,
      color,
      icon
    })
  }

  return { categories, addCategory }
})

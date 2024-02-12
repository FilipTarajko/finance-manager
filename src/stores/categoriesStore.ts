import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { type Category } from '../types/types'
import { useStorage } from '@vueuse/core'

export const useCategoriesStore = defineStore('categoriesStore', () => {
  const categories: Ref<Category[]> = useStorage('categories', [
    {
      id: 1,
      name: 'Eating out',
      color: '#d16900',
      icon: 'mdi-silverware-variant'
    },
    {
      id: 2,
      name: 'Education',
      color: '#ffff22',
      icon: 'mdi-school'
    },
    {
      id: 3,
      name: 'Groceries',
      color: '#00ff77',
      icon: 'mdi-shopping'
    },
    {
      id: 4,
      name: 'Gifts',
      color: '#00aaff',
      icon: 'mdi-gift'
    },
    {
      id: 5,
      name: 'Transportation',
      color: '#ff0088',
      icon: 'mdi-train-car'
    },
    {
      id: 6,
      name: 'WWWWWWWWWWWWWW',
      color: '#ff3000',
      icon: 'mdi-help'
    },
    {
      id: 7,
      name: 'WWWWWWWWWWWWW2',
      color: '#ff0300',
      icon: 'mdi-help'
    },
    {
      id: 8,
      name: 'WWWWWWWWWWWWW3',
      color: '#af0000',
      icon: 'mdi-help'
    },
    {
      id: 9,
      name: 'WWWWWWWWWWWWW4',
      color: '#fff000',
      icon: 'mdi-help'
    },
    {
      id: 10,
      name: 'WWWWWWWWWWWWW5',
      color: '#ff00dd',
      icon: 'mdi-help'
    },
    {
      id: 11,
      name: 'test category6',
      color: '#accdda',
      icon: 'mdi-help'
    },
    {
      id: 12,
      name: 'test category7',
      color: '#accdda',
      icon: 'mdi-help'
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

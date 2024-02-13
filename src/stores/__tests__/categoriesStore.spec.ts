import { setActivePinia, createPinia } from 'pinia'
import { useCategoriesStore } from '../categoriesStore'
import { describe, beforeEach, it, expect } from 'vitest'

describe('categoriesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds new category', () => {
    const categoriesStore = useCategoriesStore()
    categoriesStore.addCategory('test category name', '#afb034', 'testIconName')
    const lastElement = categoriesStore.categories[categoriesStore.categories.length - 1]
    expect(lastElement.name).toEqual('test category name')
    expect(lastElement.color).toEqual('#afb034')
    expect(lastElement.icon).toEqual('testIconName')
  })
})

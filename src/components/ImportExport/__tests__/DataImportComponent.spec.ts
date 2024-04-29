import { describe, it, expect } from 'vitest'
import { isCategory } from '../DataImportComponent.vue'

describe('Import helper: isCategory', () => {
  it('Gives true when given a primitive', () => {
    const result = isCategory(3) || isCategory('') || isCategory(true)
    expect(result).toBe(false)
  })
  it('Gives true when given a category with an empty transactions array', () => {
    const result = isCategory({
      id: 0,
      name: 'g',
      color: '#ff6600',
      icon: 'mdi-help',
      transactions: []
    })
    expect(result).toBe(true)
  })
  it('Gives false when given a category with an invalid transactions property', () => {
    const result = isCategory({
      id: 0,
      name: 'g',
      color: '#ff6600',
      icon: 'mdi-help',
      transactions: [{}]
    })
    expect(result).toBe(false)
  })
})

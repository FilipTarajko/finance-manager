import { type Ref } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const darkTheme: Ref<boolean> = useStorage('darkTheme', () => {
    // by default, use preferred color scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const theme = useTheme()
  applyTheme()

  function toggleTheme() {
    darkTheme.value = !darkTheme.value
    applyTheme()
  }

  function applyTheme() {
    if (darkTheme.value) {
      document.getElementsByTagName('html')[0].classList.add('dark')
    } else {
      document.getElementsByTagName('html')[0].classList.remove('dark')
    }
    theme.global.name.value = darkTheme.value ? 'dark' : 'light'
  }

  return {
    darkTheme,
    toggleTheme
  }
})

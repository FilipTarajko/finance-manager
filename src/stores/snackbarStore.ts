import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', () => {
  const snackbarText = ref('snackbar text')
  const isSnackbarDisplayed = ref(false)
  const snackbarColor = ref('red')

  function showSnackbarMessage(color: string, text: string) {
    snackbarColor.value = color
    snackbarText.value = text
    isSnackbarDisplayed.value = true
  }

  return {
    showSnackbarMessage,
    isSnackbarDisplayed,
    snackbarText,
    snackbarColor
  }
})

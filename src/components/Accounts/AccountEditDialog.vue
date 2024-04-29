<script setup lang="ts">
import AccountForm from '@/components/Accounts/AccountForm.vue'
import type { Account } from '@/types/types'
import type { Ref } from 'vue'

const isDialogShown: Ref<boolean | undefined> = defineModel()

defineProps<{
  editedAccount: Account | null
}>()
</script>

<template>
  <v-dialog width="auto" v-model="isDialogShown">
    <v-card>
      <v-card-text>
        <AccountForm
          :account="editedAccount ?? undefined"
          :hideDialog="
            () => {
              isDialogShown = false
            }
          "
        >
        </AccountForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

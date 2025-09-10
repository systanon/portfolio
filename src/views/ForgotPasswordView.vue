<template>
  <div class="forgot-pass-page">
    <form class="forgot-pass-page__form" @submit.prevent="submitHandler">
      <h2 class="forgot-pass-page__title">Forgot password</h2>
      <UiInput
        v-model="email"
        label="Email"
        placeholder="Enter email"
        :validation="v$.email"
      />
      <UiButton type="submit" label="Submit" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { application } from '@/application'
import UiInput from '@/components/UiInput.vue'
import UiButton from '@/components/UiButton.vue'

import useVuelidate from '@vuelidate/core'
import {
  required,
  helpers,
  maxLength,
  email as emailValidation,
} from '@vuelidate/validators'

const email = ref<string>('')

const rules = {
  email: {
    required: helpers.withMessage('Email is required', required),
    maxLength: helpers.withMessage('To much characters', maxLength(50)),
    emailValidation: helpers.withMessage('invalid email', emailValidation),
  },
}

const v$ = useVuelidate(rules, {
  email,
})

const submitHandler = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  const payload = {
    email: email.value,
  }

  await application.forgotPassword(payload)
}
</script>

<style scoped lang="scss">
.forgot-pass-page {
  display: flex;
  justify-content: center;
  &__title {
    text-align: center;
    color: var(--text-color-primary);
  }
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--bg-primary);
    padding: 2rem;
    border-radius: 1rem;
    width: rem(500);
    max-width: rem(500);
  }
}
</style>

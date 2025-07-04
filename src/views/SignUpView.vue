<template>
  <section class="page-sign-up">
    <form class="page-sign-up__form" @submit.prevent="submitHandler">
      <h2 class="page-sign-up__form-title">Sign up</h2>
      <UiInput
        v-model="email"
        label="Email"
        placeholder="Enter email"
        :validation="v$.email"
      />
      <UiInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        :validation="v$.password"
      />
      <UiInput
        v-model="confirmPassword"
        label="Confirm password"
        type="password"
        placeholder="Confirm your password"
        :validation="v$.confirmPassword"
      />
      <UiButton type="submit" label="Submit" />
    </form>
  </section>
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
  minLength,
  sameAs,
  maxLength,
  email as emailValidation,
} from '@vuelidate/validators'

const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const rules = {
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Minimum 6 characters', minLength(6)),
  },
  email: {
    required: helpers.withMessage('Email is required', required),
    maxLength: helpers.withMessage('To much characters', maxLength(50)),
    emailValidation: helpers.withMessage('invalid email', emailValidation),
  },
  confirmPassword: {
    required,
    sameAsPassword: helpers.withMessage(
      'Passwords do not match',
      sameAs(password)
    ),
  },
}
const v$ = useVuelidate(rules, {
  email,
  password,
  confirmPassword,
})

const submitHandler = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  const payload = {
    email: email.value,
    password: password.value,
  }

  try {
    const response = await application.signUp(payload)
    console.log('Registration success:', response)
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>

<style scoped lang="scss">
.page-sign-up {
  display: flex;
  height: 100%;
  justify-content: center;
  margin-top: 6rem;
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: max-content;
    background-color: var(--bg-primary);
    padding: 2rem;
    border-radius: 1rem;
    width: rem(320);
    &-title {
      text-align: center;
    }
  }
}
</style>

<template>
  <section class="page-sign-in">
    <form class="page-sign-in__form" @submit.prevent="submitHandler">
      <h2 class="page-sign-in__form-title">Sign in</h2>
      <UiInput
        v-model="email"
        label="Email"
        placeholder="Enter email"
        :validation="v$.email"
      />
      <UiInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        :validation="v$.password"
      />
      <div class="page-sign-in__redirect">
        <AppLink
          class="page-sign-in__redirect-link"
          inactive-class="link-secondary"
          active-class="link-secondary--active"
          :to="{ name: 'ForgotPassword' }"
        >
          Forgot password?</AppLink
        >
        <AppLink
          class="page-sign-in__redirect-link"
          :to="{ name: 'ResendEmailVerification' }"
          inactive-class="link-secondary"
          active-class="link-secondary--active"
          >Resend verification email?</AppLink
        >
      </div>
      <UiButton type="submit" label="Submit" />
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { application } from '@/application'
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import useVuelidate from '@vuelidate/core'
import {
  required,
  helpers,
  email as emailValidation,
} from '@vuelidate/validators'
import AppLink from '@/components/AppLink.vue'
const email = ref('')
const password = ref('')

const rules = {
  password: { required: helpers.withMessage('Password is required', required) },
  email: {
    required: helpers.withMessage('Email is required', required),
    emailValidation: helpers.withMessage('invalid email', emailValidation),
  },
}
const v$ = useVuelidate(rules, { password, email })

const submitHandler = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  const payload = {
    email: email.value,
    password: password.value,
  }

  try {
    const response = await application.signIn(payload)
    console.log('Login success:', response)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped lang="scss">
.page-sign-in {
  display: flex;
  min-height: 0;
  justify-content: center;
  margin-top: 6rem;
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
    background-color: var(--bg-primary);
    padding: 2rem;
    border-radius: 1rem;
    width: rem(400);
    max-width: rem(400);
    &-title {
      text-align: center;
    }
  }
  &__redirect {
    display: flex;
    flex-direction: column;
    gap: rem(20);
    text-align: end;
    padding-bottom: rem(15);
  }
}
</style>

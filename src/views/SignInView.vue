<template>
  <section class="page-sign-in">
    <form class="page-sign-in__form" @submit.prevent="submit">
      <h2 class="page-sign-in__form-title">Sign in</h2>
      <UiInput
        v-model="email"
        label="Email"
        placeholder="Enter email"
        :validation="v$.email"
        autocomplete="email"
        @blur="v$.email.$touch"
      />
      <UiInput
        v-model="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        :validation="v$.password"
        autocomplete="current-password"
        @blur="v$.password.$touch"
      />
      <div class="page-sign-in__redirect">
        <AppLink
          class="page-sign-in__redirect-link"
          inactive-class="link-secondary"
          active-class="link-secondary--active"
          :to="{ name: 'ForgotPassword' }"
          @navigate="(navigate) => navigate()"
        >
          Forgot password?</AppLink
        >
        <AppLink
          class="page-sign-in__redirect-link"
          :to="{ name: 'ResendEmailVerification' }"
          inactive-class="link-secondary"
          active-class="link-secondary--active"
          @navigate="(navigate) => navigate()"
          >Resend verification email?</AppLink
        >
      </div>
      <UiButton type="submit" label="Submit" />
    </form>
  </section>
</template>

<script setup lang="ts">
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import AppLink from '@/components/AppLink.vue'
import { useSignInForm } from '@/composables/useSignInForm'

const { email, password, v$, submit } = useSignInForm()
</script>

<style scoped lang="scss">
.page-sign-in {
  display: flex;
  justify-content: center;
  margin-top: 6rem;
  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background-color: var(--bg-primary);
    padding: 2rem;
    border-radius: 1rem;
    width: 100%;
    max-width: rem(400);
    &-title {
      text-align: center;
    }
  }
  &__redirect {
    display: flex;
    flex-direction: column;
    gap: rem(20);
    align-items: flex-end;
    padding-bottom: rem(15);
  }
}
</style>

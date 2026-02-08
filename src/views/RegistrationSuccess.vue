<template>
  <section class="registration-success">
    <div class="registration-success__backdrop">
      <h2 class="registration-success__title">Confirm Your Email</h2>
      <div class="registration-success__text">
        <p>📧 We've sent a confirmation email to your inbox.</p>
        <p>Click the link in the email to activate your account.</p>
        <p class="hint">
          If you don't see the email, please check your
          <strong>Spam</strong> folder.
        </p>
      </div>
      <div class="registration-success__actions">
        <UiButton label="Go to Email" @click="goToEmail" />
        <UiButton label="Back to Sign In" @click="backToSignIn" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import type { RouteName } from '@/types/router'

const router = useRouter()

const goToEmail = () => {
  window.open('https://mail.google.com', '_blank')
}

const backToSignIn = () => {
  router.push({ name: 'SignIn' satisfies RouteName })
}
</script>

<style scoped lang="scss">
.registration-success {
  &__backdrop {
    background: $backdrop-color;
    backdrop-filter: blur($blur-filter);
    -webkit-backdrop-filter: blur($blur-filter);
    text-align: center;
    padding: rem(25);
    width: 100%;
    max-width: rem(600);
    margin: 0 auto;
  }
  &__title {
    padding-bottom: rem(25);
  }
  &__text {
    display: flex;
    flex-direction: column;
    gap: rem(5);
    padding-bottom: rem(25);
  }
  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: rem(15);
  }
}
</style>

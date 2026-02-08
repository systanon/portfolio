<template>
  <section class="email-notification">
    <div class="email-notification__backdrop">
      <h2 class="email-notification__title">
        <slot name="title"></slot>
      </h2>
      <div class="email-notification__text">
        <slot name="body"> </slot>
      </div>
      <div class="email-notification__actions">
        <slot name="actions">
          <UiButton label="Go to Email" @click="goToEmail" />
          <UiButton label="Back to Sign In" @click="backToSignIn" />
        </slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RouteName } from '@/types/router'
import UiButton from '@/components/ui/buttons/UiButton.vue'

const router = useRouter()

defineSlots<{
  title(): any
  body(): any
  actions(): any
}>()

const goToEmail = () => {
  window.open('https://mail.google.com', '_blank')
}

const backToSignIn = () => {
  router.push({ name: 'SignIn' satisfies RouteName })
}
</script>

<style scoped lang="scss">
.email-notification {
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

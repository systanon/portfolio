<template>
  <div class="resend-page">
    <form class="resend-page__form" @submit.prevent="submitHandler">
      <h2 class="resend-page__title">Resend verification email page</h2>
      <UiInput
        v-model="email"
        label="Email"
        placeholder="Enter email"
        :validation="v$.email"
      />
      <UiButton type="submit" label="Submit" :disabled="isBlocked" />
      <ProgressBar
        v-if="showProgressBar"
        ref="progressBarRef"
        :progress="false"
      >
        <span>{{ time }}</span>
      </ProgressBar>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { application } from '@/application'
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import { useValidationRules } from '@/composables/useValidationRules'
import useVuelidate from '@vuelidate/core'
import ProgressBar from '@/components/animation/ProgressBar.vue'
import { AppRateLimitError } from '@/types/app-errors'
import { useRateLimit } from '@/composables/useRateLimit'

const { isBlocked, showProgressBar, time, startRateLimit, progressBarRef } =
  useRateLimit()

const email = ref<string>('')
const { emailRules } = useValidationRules()

const rules = {
  email: emailRules,
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

  const res = await application.resendConfirmEmail(payload)
  if (res instanceof AppRateLimitError) {
    await startRateLimit(res.retryAfter)
  }
}
</script>

<style scoped lang="scss">
.resend-page {
  display: flex;
  justify-content: center;
  &__title {
    text-align: center;
    color: var(--text-color-primary);
  }
  &__form {
    display: flex;
    position: relative;
    flex-direction: column;
    gap: rem(15);
    background-color: var(--bg-primary);
    padding: rem(30);
    border-radius: rem(15);
    width: 100%;
    max-width: rem(500);
  }
}
</style>

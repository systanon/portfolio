<template>
  <div class="forgot-pass-page">
    <form class="forgot-pass-page__form" @submit.prevent="submitHandler">
      <h2 class="forgot-pass-page__title">
        {{ t('page_forgot_password.title') }}
      </h2>
      <UiInput
        v-model="email"
        :label="t('email_label')"
        :placeholder="t('page_forgot_password.email_placeholder')"
        :validation="v$.email"
      />
      <div class="forgot-pass-page__redirect">
        <AppLink
          class="forgot-pass-page__redirect-link"
          :to="{ name: 'ResendEmailVerification' }"
          inactive-class="link-secondary"
          active-class="link-secondary--active"
          @navigate="(navigate) => navigate()"
          >{{ t('page_forgot_password.resend_verification') }}</AppLink
        >
      </div>
      <UiButton type="submit" :label="t('submit')" :disabled="isBlocked" />
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
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import AppLink from '@/components/AppLink.vue'
import { useValidationRules } from '@/composables/useValidationRules'
import useVuelidate from '@vuelidate/core'
import ProgressBar from '@/components/animation/ProgressBar.vue'
import { AppRateLimitError } from '@/types/app-errors'
import { useRateLimit } from '@/composables/useRateLimit'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const email = ref<string>('')

const { forgotPassword } = useAuth()

const { emailRules } = useValidationRules()
const { isBlocked, showProgressBar, time, startRateLimit, progressBarRef } =
  useRateLimit()

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

  const res = await forgotPassword(payload)
  if (res instanceof AppRateLimitError) {
    await startRateLimit(res.retryAfter)
  }
}
</script>

<style scoped lang="scss">
.forgot-pass-page {
  display: flex;
  justify-content: center;
  &__title {
    text-align: center;
  }
  &__form {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: rem(15);
    background-color: var(--bg-primary);
    padding: rem(30);
    border-radius: rem(15);
    width: 100%;
    max-width: rem(500);
  }
  &__redirect {
    text-align: end;
    padding-bottom: rem(15);
  }
}
</style>

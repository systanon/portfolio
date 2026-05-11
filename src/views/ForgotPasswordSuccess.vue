<template>
  <section class="forgot-pass-success">
    <EmailNotification>
      <template #title> {{ t('forgot_password_success.title') }} </template>
      <template #body>
        <p>📧 {{ t('forgot_password_success.body_sent') }}</p>
        <p>{{ t('forgot_password_success.body_instructions') }}</p>
        <p>
          <i18n-t keypath="forgot_password_success.body_spam">
            <template #folder>
              <span class="forgot-pass-success__hint">
                {{ t('forgot_password_success.folder') }}
              </span>
            </template>
          </i18n-t>
        </p>
      </template>
    </EmailNotification>
  </section>
</template>

<script setup lang="ts">
import EmailNotification from '@/components/EmailNotification.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
.forgot-pass-success {
  &__hint {
    font-weight: 900;
  }
}
</style>

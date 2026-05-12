<template>
  <section class="registration-success">
    <EmailNotification>
      <template #title> {{ t('registration_success.title') }} </template>
      <template #body>
        <p>📧 {{ t('registration_success.body_sent') }}</p>
        <p>{{ t('registration_success.body_instructions') }}</p>
        <p>
          <i18n-t keypath="registration_success.body_spam">
            <template #folder>
              <span class="forgot-pass-success__hint">
                {{ t('registration_success.folder') }}
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
.registration-success {
  &__hint {
    font-weight: 900;
  }
}
</style>

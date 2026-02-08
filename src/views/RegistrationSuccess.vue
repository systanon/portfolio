<template>
  <section class="registration-success">
    <EmailNotification>
      <template #title> Confirm Your Email </template>
      <template #body>
        <p>📧 We've sent a confirmation email to your inbox.</p>
        <p>Click the link in the email to activate your account.</p>
        <p>
          If you don't see the email, please check your
          <span class="registration-success__hint">Spam</span> folder.
        </p>
      </template>
    </EmailNotification>
  </section>
</template>

<script setup lang="ts">
import EmailNotification from '@/components/EmailNotification.vue'
</script>

<style scoped lang="scss">
.registration-success {
  &__hint {
    font-weight: 900;
  }
}
</style>

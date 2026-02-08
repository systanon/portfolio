<template>
  <section class="forgot-pass-success">
    <EmailNotification>
      <template #title> Check Your Email </template>
      <template #body>
        <p>📧 We’ve sent a password reset link to your email.</p>
        <p>Follow the instructions in the email to reset your password.</p>
        <p>
          If you don't see the email, please check your
          <span class="forgot-pass-success__hint">Spam</span> folder.
        </p>
      </template>
    </EmailNotification>
  </section>
</template>

<script setup lang="ts">
import EmailNotification from '@/components/EmailNotification.vue'
</script>

<style scoped lang="scss">
.forgot-pass-success {
  &__hint {
    font-weight: 900;
  }
}
</style>

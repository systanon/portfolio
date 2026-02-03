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
      <UiButton type="submit" label="Submit" />
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

  await application.resendConfirmEmail(payload)
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
    flex-direction: column;
    gap: rem(15);
    background-color: var(--bg-primary);
    padding: rem(30);
    border-radius: rem(15);
    width: rem(500);
    max-width: rem(500);
  }
}
</style>

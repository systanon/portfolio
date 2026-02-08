<template>
  <section class="reset-pass">
    <form class="reset-pass__form" @submit.prevent="submitHandler">
      <h2 class="reset-pass__form-title">Reset password</h2>
      <UiInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        :validation="v$.password"
      />
      <UiInput
        v-model="confirmPassword"
        label="Confirm password"
        type="password"
        placeholder="Confirm your password"
        :validation="v$.confirmPassword"
      />
      <UiButton type="submit" label="Submit" />
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { application } from '@/application'
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import useVuelidate from '@vuelidate/core'
import { useRoute } from 'vue-router'
import { useValidationRules } from '@/composables/useValidationRules'

const route = useRoute()
const password = ref<string>('')
const confirmPassword = ref<string>('')
const { passwordRules, confirmPasswordRules } = useValidationRules()
const rules = {
  password: passwordRules,
  confirmPassword: confirmPasswordRules(password),
}
const v$ = useVuelidate(rules, {
  password,
  confirmPassword,
})

const submitHandler = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  const payload = {
    password: password.value,
    token: typeof route.query.token === 'string' ? route.query.token : '',
  }

  await application.resetPassword(payload)
}
</script>

<style scoped lang="scss">
.reset-pass {
  display: flex;
  justify-content: center;
  &__form {
    display: flex;
    flex-direction: column;
    gap: rem(15);
    background-color: var(--bg-primary);
    padding: rem(30);
    border-radius: rem(15);
    width: 100%;
    max-width: rem(400);
    &-title {
      text-align: center;
    }
  }
}
</style>

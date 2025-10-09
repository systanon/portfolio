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
import { required, helpers, minLength, sameAs } from '@vuelidate/validators'
import { useRoute } from 'vue-router'

const route = useRoute()
const password = ref<string>('')
const confirmPassword = ref<string>('')

const rules = {
  password: {
    required: helpers.withMessage('Password is required', required),
    minLength: helpers.withMessage('Minimum 6 characters', minLength(6)),
  },
  confirmPassword: {
    required,
    sameAsPassword: helpers.withMessage(
      'Passwords do not match',
      sameAs(password)
    ),
  },
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
  min-height: 0;
  justify-content: center;
  margin-top: 6rem;
  &__form {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
    gap: 1rem;
    background-color: var(--bg-primary);
    padding: 2rem;
    border-radius: 1rem;
    width: rem(400);
    max-width: rem(400);
    &-title {
      text-align: center;
    }
  }
}
</style>

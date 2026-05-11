<template>
  <section class="page-sign-up">
    <form class="page-sign-up__form" @submit.prevent="submitHandler">
      <h2 class="page-sign-up__form-title">{{ t('page_sign_up.title') }}</h2>
      <UiInput
        v-model="email"
        :label="t('email_label')"
        :placeholder="t('email_placeholder')"
        autocomplete="email"
        :validation="v$.email"
      />
      <UiInput
        v-model="password"
        type="password"
        :label="t('password_label')"
        :placeholder="t('password_placeholder')"
        :validation="v$.password"
        autocomplete="new-password"
      />
      <UiInput
        v-model="confirmPassword"
        :label="t('confirm_password_label')"
        type="password"
        :placeholder="t('confirm_password_placeholder')"
        autocomplete="new-password"
        :validation="v$.confirmPassword"
      />
      <div class="page-sign-up__redirect">
        <span class="page-sign-up__redirect-text">{{
          t('page_sign_up.redirect_to_sign_in')
        }}</span>

        <AppLink
          :to="{ name: 'SignIn' }"
          inactive-class="link-secondary"
          active-class="link-secondary--active"
          @navigate="(navigate) => navigate()"
          >{{ t('page_sign_in.title') }}</AppLink
        >
      </div>
      <UiButton type="submit" :label="t('submit')" />
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import useVuelidate from '@vuelidate/core'
import AppLink from '@/components/AppLink.vue'
import { useValidationRules } from '@/composables/useValidationRules'
import { useAuth } from '@/composables/useAuth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { signUp } = useAuth()

const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const { emailRules, passwordRules, confirmPasswordRules } = useValidationRules()
const rules = {
  password: passwordRules,
  email: emailRules,
  confirmPassword: confirmPasswordRules(password),
}
const v$ = useVuelidate(rules, {
  email,
  password,
  confirmPassword,
})

const submitHandler = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  const payload = {
    email: email.value,
    password: password.value,
  }

  signUp(payload)
}
</script>

<style scoped lang="scss">
.page-sign-up {
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
  &__redirect {
    text-align: center;
    padding-bottom: rem(15);
    &-text {
      padding-right: rem(10);
    }
  }
}
</style>

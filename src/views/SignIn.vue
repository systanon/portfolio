<template>
  <section class="page-sign-in">
    <form class="page-sign-in__form" @submit.prevent="submit">
      <h2 class="page-sign-in__form-title">{{ t('page_sign_in.title') }}</h2>
      <UiInput
        v-model="email"
        :label="t('common.labels.email')"
        :placeholder="t('common.placeholders.email')"
        :validation="v$.email"
        autocomplete="email"
      />
      <UiInput
        v-model="password"
        :label="t('common.labels.password')"
        type="password"
        :placeholder="t('common.placeholders.password')"
        :validation="v$.password"
        autocomplete="current-password"
      />
      <div class="page-sign-in__redirect">
        <AppLink
          class="page-sign-in__redirect-link"
          inactive-class="link-secondary"
          active-class="link-secondary--active"
          :to="{ name: 'ForgotPassword' }"
          @navigate="(navigate) => navigate()"
        >
          {{ t('page_sign_in.forgot_password') }}
        </AppLink>
      </div>
      <UiButton type="submit" :label="t('common.actions.submit')" />
    </form>
  </section>
</template>

<script setup lang="ts">
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import AppLink from '@/components/AppLink.vue'
import { useSignInForm } from '@/composables/useSignInForm'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { email, password, v$, submit } = useSignInForm()
</script>

<style scoped lang="scss">
.page-sign-in {
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
    display: flex;
    flex-direction: column;
    gap: rem(20);
    align-items: flex-end;
    padding-bottom: rem(15);
  }
}
</style>

<template>
  <section class="page-sign-up">
    <form class="page-sign-up__form" @submit.prevent="submitHandler">
      <h2 class="page-sign-up__form-title">Sign up</h2>
      <UiInput
        v-model="username"
        label="User name"
        placeholder="Enter user name"
        :validation="v$.username"
      />
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
  import { ref } from 'vue';
  import { application } from '@/application';
  import UiInput from '@/components/UiInput.vue';
  import UiButton from '@/components/UiButton.vue';
  import useVuelidate from '@vuelidate/core';
  import { required, helpers, minLength, sameAs, maxLength } from '@vuelidate/validators';

  const username = ref<string>('');
  const password = ref<string>('');
  const confirmPassword = ref<string>('');

  const rules = {
    password: {
      required: helpers.withMessage('Password is required', required),
      minLength: helpers.withMessage('Minimum 6 characters', minLength(6)),
    },
    username: {
      required: helpers.withMessage('User name is required', required),
      maxLength: helpers.withMessage('To much characters', maxLength(50)),
    },
    confirmPassword: {
      required,
      sameAsPassword: helpers.withMessage('Passwords do not match', sameAs(confirmPassword)),
    },
  };
  const v$ = useVuelidate(rules, {
    username,
    password,
    confirmPassword,
  });

  const submitHandler = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;
    const payload = {
      username: username.value,
      password: password.value,
    };

    try {
      const response = await application.signUp(payload);
      console.log('Registration success:', response);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
</script>

<style scoped lang="scss">
  .page-sign-up {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    &__form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: max-content;
      &-title {
        text-align: center;
      }
    }
  }
</style>

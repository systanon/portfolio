<template>
  <section class="page-sign-in">
    <form class="page-sign-in__form" @submit.prevent="submitHandler">
      <UiInput v-model="email" label="Email" placeholder="Enter email" :validation="v$.email" />
      <UiInput
        v-model="password"
        label="Password"
        placeholder="Enter your password"
        :validation="v$.password"
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
  import { required, helpers } from '@vuelidate/validators';
  const email = ref('');
  const password = ref('');

  const rules = {
    password: { required: helpers.withMessage('Password is required', required) },
    email: { required: helpers.withMessage('Email is required', required) },
  };
  const v$ = useVuelidate(rules, { password, email });

  const submitHandler = async () => {
    const isValid = await v$.value.$validate();
    if (!isValid) return;
    const payload = {
      email: email.value,
      password: password.value,
    };

    try {
      const response = await application.signIn(payload);
      console.log('Login success:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
</script>

<style scoped lang="scss">
  .page-sign-in {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    &__form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: max-content;
    }
  }
</style>

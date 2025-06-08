<template>
  <section class="sign-in">
    <form @submit.prevent="submitHandler">
      <input v-model="username" type="text" placeholder="username" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Submit</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { application } from '@/application'
const username = ref('')
const password = ref('')

const submitHandler = async () => {
  const payload = {
    username: username.value,
    password: password.value,
  }

  try {
    const response = await application.signIn(payload)
    console.log('Login success:', response)
  } catch (error) {
    console.error('Login failed:', error)
  }
}
</script>

<style scoped>
.sign-in {
  max-width: 400px;
  margin: 2rem auto;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
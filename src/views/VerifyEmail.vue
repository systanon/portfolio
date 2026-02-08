<template>
  <div class="confirm-page">
    <h2 class="confirm-page__title">Verification email page</h2>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { application } from '@/application'
import type { ConfirmQuery } from '@/types/auth'

const route = useRoute()

const token: ConfirmQuery = {
  token: typeof route.query.token === 'string' ? route.query.token : '',
}

onMounted(() => {
  application.confirmEmail(token)
})
</script>

<style scoped lang="scss">
.confirm-page {
  text-align: center;
  &__title {
    color: var(--text-color-primary);
  }
}
</style>

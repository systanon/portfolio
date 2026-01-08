<template>
  <AppLink :to="{ name: 'Home' }">
    <UiIcon name="logo" :width="rem(80)" :height="rem(80)" />
  </AppLink>
</template>

<script lang="ts" setup>
import AppLink from './AppLink.vue'
import UiIcon from './ui/icons/UiIcon.vue'
import { rem } from '@/utils/rem'
</script>

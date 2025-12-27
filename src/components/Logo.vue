<template>
  <AppLink :to="{ name: 'Home' }">
    <UiIcon name="logo" />
  </AppLink>
</template>

<script lang="ts" setup>
import AppLink from './AppLink.vue'
import UiIcon from './ui/icons/UiIcon.vue'
</script>
<style lang="scss" scoped>
:deep(.ui-icon) {
  height: rem(80);
  width: rem(80);
}
</style>

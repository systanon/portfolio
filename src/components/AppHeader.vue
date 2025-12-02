<script lang="ts" setup>
import NavigationMenu from '@/components/NavigationMenu.vue'
import NavigationMenuMobile from './NavigationMenuMobile.vue'
import { useInjectWindowResize } from '@/composables/useWindowResize'

const { isTablet, isMobile } = useInjectWindowResize()
</script>

<template>
  <header class="app-header">
    <div class="container">
      <NavigationMenuMobile v-if="isMobile || isTablet" />
      <NavigationMenu v-else />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  gap: 15px;
  padding: 1rem;
  justify-content: end;
}
@include media-query('tablet') {
  .app-header {
    padding: 2rem;
  }
}
</style>

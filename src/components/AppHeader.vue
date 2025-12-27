<script lang="ts" setup>
import NavigationMenu from '@/components/NavigationMenu.vue'
import NavigationMenuMobile from './NavigationMenuMobile.vue'
import { useInjectWindowResize } from '@/composables/useWindowResize'
import Logo from '@/components/Logo.vue'

const { isTablet, isMobile } = useInjectWindowResize()
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="app-header__wrapper">
        <Logo />
        <NavigationMenuMobile v-if="isMobile || isTablet" />
        <NavigationMenu v-else />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  padding: rem(16);
  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
@include media-query('tablet') {
  .app-header {
    padding: rem(32);
  }
}
</style>

<script lang="ts" setup>
  import NavigationMenu from '@/components/NavigationMenu.vue';
  import NavigationMenuMobile from './NavigationMenuMobile.vue';
  import { useInjectWindowResize } from '@/composables/useWindowResize';

  const { isTablet, isMobile } = useInjectWindowResize();
</script>

<template>
  <header class="app-header">
    <NavigationMenuMobile v-if="isMobile || isTablet" />
    <NavigationMenu v-else />
  </header>
</template>

<style scoped lang="scss">
  .app-header {
    display: flex;
    justify-content: end;
    gap: 15px;
    padding: 2rem;
  }
</style>

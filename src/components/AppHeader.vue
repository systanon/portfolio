<script lang="ts" setup>
  import { computed } from 'vue';
  import NavigationMenu from '@/components/NavigationMenu.vue';
  import { application } from '@/application';

  const isLogged = computed(() => application.isLogged);
</script>

<template>
  <header class="app-header">
    <NavigationMenu />
    <button class="app-header__logout"v-if="isLogged" @click="application.logout">Logout</button>
  </header>
</template>

<style scoped lang="scss">
  .app-header {
    display: flex;
    justify-content: end;
    gap: 15px;
  }
</style>

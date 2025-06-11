<script lang="ts">
  import { defineComponent } from 'vue';
  import GlobalLoader from '@/components/GlobalLoader.vue';
  import AppHeader from '@/components/AppHeader.vue';

  export default defineComponent({
    components: {
      GlobalLoader,
      AppHeader,
    },
  });
</script>

<template>
  <AppHeader />
  <router-view />
  <GlobalLoader />
</template>

<style scoped></style>

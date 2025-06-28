<script lang="ts">
  import { defineComponent } from 'vue';
  import GlobalLoader from '@/components/GlobalLoader.vue';
  import { useWindowResize } from './composables/useWindowResize';

  export default defineComponent({
    components: {
      GlobalLoader,
    },
    setup() {
      useWindowResize();
    },
  });
</script>

<template>
  <router-view />
  <GlobalLoader />
</template>

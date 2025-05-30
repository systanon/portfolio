<script lang="ts">
import { defineComponent } from "vue";
import GlobalLoader from "./components/GlobalLoader.vue";

export default defineComponent({
  components: {
    GlobalLoader,
  },
});
</script>

<template>
  <router-view />
  <GlobalLoader />
</template>

<style scoped>
</style>

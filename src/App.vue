<script lang="ts">
import { defineComponent } from "vue";
import GlobalLoader from "@/components/GlobalLoader.vue";
import NavigationMenu from "@/components/NavigationMenu.vue";

export default defineComponent({
  components: {
    GlobalLoader,
    NavigationMenu,
  },
});
</script>

<template>
  <NavigationMenu/>
  <router-view />
  <GlobalLoader />
</template>

<style scoped>
</style>

<template>
  <nav class="navigation-menu">
    <RouterLink v-for="{ path, text } in navigationList" :key="path" :to="path">
      {{ text }}
    </RouterLink>
    <UiButton label="Logout" v-if="isLogged" />
  </nav>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { byAuthorized, mainMenu, type NavigationMenu } from '@/config/main-menu';
  import { application } from '@/application';
  import UiButton from './UiButton.vue';

  export default defineComponent({
    name: 'NavigationMenu',
    components: { UiButton },
    computed: {
      isLogged() {
        return application.isLogged;
      },
      navigationList(): NavigationMenu {
        return mainMenu.filter(byAuthorized(this.isLogged));
      },
    },
  });
</script>
<style scoped lang="scss">
  .navigation-menu {
    display: flex;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
    gap: 25px;
    margin: 0;
    padding: 0;

    :deep(.router-link-exact-active) {
      color: orange;
    }
  }
</style>

<template>
  <!-- TODO: use vue router link -->
  <ul class="navigation-menu">
    <li v-for="{ path, text } in navigationList" :key="path"
      :class="['navigation-menu__item', { _active: $route.path === path }]" @click="$router.push(path)">
      <h2>{{ text }}</h2>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { byAuthorized, mainMenu, type NavigationMenu } from "@/config/main-menu";
import { application } from "@/application"

export default defineComponent({
  name: "NavigationMenu",
  computed: {
    isLogged() {
      return application.isLodged
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

  &__item {
    cursor: pointer;

    &._active {
      color: orange;
    }
  }

  &__item-select-option {
    display: block;
    box-sizing: border-box;
    padding-left: 3px;
    padding-right: 3px;
    max-width: 70px;
  }
}
</style>

<template>
  <nav class="navigation-menu">
    <AppLink
      v-for="{ path, text, routeName } in navigationList"
      :key="path"
      :to="{ name: routeName }"
      inactive-class="link"
      exactActiveClass="link--active"
    >
      {{ text }}
    </AppLink>
    <UiButton label="Logout" v-if="isLogged" @click="logout" />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { byAuthorized, mainMenu, type NavigationMenu } from '@/config/main-menu'
import { application } from '@/application'
import UiButton from './ui/buttons/UiButton.vue'
import AppLink from './AppLink.vue'

export default defineComponent({
  name: 'NavigationMenu',
  components: { UiButton, AppLink },
  computed: {
    isLogged() {
      return application.isLogged
    },
    navigationList(): NavigationMenu {
      return mainMenu.filter(byAuthorized(this.isLogged))
    },
  },
  methods: {
    logout() {
      application.logout()
    },
  },
})
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
}
</style>

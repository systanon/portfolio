<script lang="ts">
import { defineComponent, type Directive } from 'vue'
import { vOnClickOutside as baseOnClickOutside } from '@vueuse/components'
import UIButtonIcon from '@/components/UiButtonIcon.vue'
import NavigationMenu from './NavigationMenu.vue'

const vOnClickOutside: Directive = baseOnClickOutside

export default defineComponent({
  name: 'NavigationMenuMobile',
  components: {
    UIButtonIcon,
    NavigationMenu,
  },
  directives: {
    onClickOutside: vOnClickOutside,
  },
  data() {
    return {
      isNavOpen: false,
    }
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen
    },
    close() {
      this.isNavOpen = false
    },
  },
})
</script>

<template>
  <nav class="app-nav">
    <UIButtonIcon
      class="app-nav__burger-menu"
      @click="toggleNav"
      iconName="burger-menu"
    />
  </nav>
  <aside
    class="app-navigation"
    :class="{ open: isNavOpen }"
    v-on-click-outside="close"
  >
    <UIButtonIcon @click="toggleNav" iconName="close-square" />
    <NavigationMenu @click="close" />
  </aside>
</template>

<style lang="scss" scoped>
.app-nav {
  display: flex;
  align-items: center;

  &__burger-menu {
    background-color: transparent;
    transition: opacity 0.3s ease-in-out;
    color: $text-color-primary;
  }
}

.app-navigation {
  background-color: $bg-menu-secondary;
  padding: 1em;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1em;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 100;

  .navigation-menu {
    width: 100%;
    color: $text-color-primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    &__item {
      cursor: pointer;
    }
  }
}

.app-navigation.open {
  transform: translateX(0);
}
</style>

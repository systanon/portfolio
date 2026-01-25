<template>
  <div class="app-nav">
    <UIButtonIcon
      class="app-nav__burger-menu"
      @click="toggleNav"
      iconName="burger-menu"
    />
  </div>
  <Transition name="slide">
    <aside v-if="isNavOpen" class="app-navigation" v-on-click-outside="close">
      <UIButtonIcon @click="toggleNav" iconName="close-square" />
      <nav class="app-navigation__menu">
        <AppLink
          v-for="{ path, text, routeName } in menuList"
          :key="path"
          :to="{ name: routeName }"
          inactive-class="link"
          exactActiveClass="link--active"
          @click="close"
        >
          {{ text }}
        </AppLink>
      </nav>
    </aside>
  </Transition>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Directive } from 'vue'
import { vOnClickOutside as baseOnClickOutside } from '@vueuse/components'
import { byAuthorized, mainMenu } from '@/config/main-menu'
import UIButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import AppLink from './AppLink.vue'
import { useLogged } from '@/composables/useLogged'

const vOnClickOutside: Directive = baseOnClickOutside

const isNavOpen = ref(false)

const { isLogged } = useLogged()

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const close = () => {
  isNavOpen.value = false
}

const menuList = computed(() => {
  return mainMenu.filter(byAuthorized(isLogged.value))
})
</script>

<style lang="scss" scoped>
.app-nav {
  display: flex;
  justify-content: end;
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
  z-index: 100;

  &__menu {
    width: 100%;
    color: $text-color-primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(30);
    font-size: rem(22);
  }
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>

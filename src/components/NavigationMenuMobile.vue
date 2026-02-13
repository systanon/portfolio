<template>
  <BurgerButton ref="burgerRef" @click="toggleNav" />

  <aside ref="navRef" class="app-navigation">
    <nav ref="menuRef" class="app-navigation__menu" v-on-click-outside="close">
      <AppLink
        v-for="{ path, text, routeName } in menuList"
        :key="path"
        :to="{ name: routeName }"
        inactive-class="link"
        exactActiveClass="link--active"
        @navigate="onLinkNavigate"
      >
        {{ text }}
      </AppLink>
    </nav>
  </aside>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Directive } from 'vue'
import { vOnClickOutside as baseOnClickOutside } from '@vueuse/components'
import { byAuthorized, mainMenu } from '@/config/main-menu'
import AppLink from './AppLink.vue'
import { useLogged } from '@/composables/useLogged'
import BurgerButton, { type IBurgerButton } from './ui/buttons/BurgerButton.vue'
import { useEscapeKey } from '@/composables/useEscapeKey'
import { createNavBar } from '@/animations'

const vOnClickOutside: Directive = baseOnClickOutside
const isNavOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
const burgerRef = ref<IBurgerButton | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const { isLogged } = useLogged()

useEscapeKey(close)
const play = ref<() => void>(() => {})
const playReverse = ref<() => void>(() => {})
const kill = ref<() => void>(() => {})

const toggleNav = async () => {
  const toggle = !isNavOpen.value
  if (toggle) {
    burgerRef.value?.play()
    play.value()
  } else {
    burgerRef.value?.reverse()
    await playReverse.value()
  }
  isNavOpen.value = toggle
}

async function close() {
  burgerRef.value?.reverse()
  await playReverse.value()

  isNavOpen.value = false
}

const onLinkNavigate = async (navigate: () => void) => {
  burgerRef.value?.reverse()
  await playReverse.value()

  isNavOpen.value = false

  navigate()
}

const menuList = computed(() => {
  return mainMenu.filter(byAuthorized(isLogged.value))
})

const initAnimation = () => {
  if (!navRef.value || !menuRef.value) return

  const items = menuRef.value.children
  const navBar = createNavBar(navRef.value, items)

  navBar.init()

  play.value = navBar.play
  playReverse.value = navBar.playReverse
  kill.value = navBar.kill
}

onMounted(async () => {
  initAnimation()
})
</script>

<style lang="scss" scoped>
.app-navigation {
  background-color: $bg-menu-secondary;
  padding: rem(15);
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: rem(15);
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transform: translateX(-100%);
  will-change: transform;

  &__menu {
    width: 100%;
    padding-top: rem(60);
    color: $text-color-primary;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(30);
    font-size: rem(22);
  }
}
</style>

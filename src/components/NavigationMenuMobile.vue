<template>
  <BurgerButton ref="burgerRef" @click="toggleNav" />

  <aside ref="navRef" v-show="isNavOpen" class="app-navigation">
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
import { useGsap } from '@/composables/useGsap'
import { useEscapeKey } from '@/composables/useEscapeKey'

const vOnClickOutside: Directive = baseOnClickOutside
const gsap = useGsap()

const isNavOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
const burgerRef = ref<IBurgerButton | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const { isLogged } = useLogged()

useEscapeKey(close)

let tl: gsap.core.Timeline

const playReverse = () =>
  new Promise<void>((resolve) => {
    tl.eventCallback('onReverseComplete', () => resolve())
    tl.reverse()
  })

const toggleNav = async () => {
  const toggle = !isNavOpen.value
  if (toggle) {
    burgerRef.value?.play()
    tl.play()
  } else {
    burgerRef.value?.reverse()
    await playReverse()
  }
  isNavOpen.value = toggle
}

async function close() {
  burgerRef.value?.reverse()
  await playReverse()
  isNavOpen.value = false
}

const onLinkNavigate = async (navigate: () => void) => {
  if (!tl) return

  burgerRef.value?.reverse()
  await playReverse()
  isNavOpen.value = false

  navigate()
}

const menuList = computed(() => {
  return mainMenu.filter(byAuthorized(isLogged.value))
})

const initAnimation = () => {
  if (!navRef.value || !menuRef.value) return

  const items = menuRef.value.children

  tl = gsap.timeline({ paused: true })

  tl.fromTo(
    navRef.value,
    { x: '-100%' },
    { x: '0%', duration: 0.35, ease: 'power3.out' },
    0,
  ).from(
    items,
    {
      y: 20,
      opacity: 0,
      stagger: 0.06,
      duration: 0.25,
      ease: 'power2.out',
    },
    0.15,
  )
}

onMounted(() => {
  initAnimation()
})
</script>

<style lang="scss" scoped>
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

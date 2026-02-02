<template>
  <nav class="navigation-menu">
    <div class="navigation-menu__items _left">
      <AppLink
        v-for="{ path, text, routeName } in left"
        :key="path"
        :to="{ name: routeName }"
        inactive-class="link"
        exactActiveClass="link--active"
        @navigate="onLinkNavigate"
      >
        {{ text }}
      </AppLink>
    </div>
    <Logo />
    <div class="navigation-menu__items _right">
      <AppLink
        v-for="{ path, text, routeName } in right"
        :key="path"
        :to="{ name: routeName }"
        inactive-class="link"
        exactActiveClass="link--active"
        @navigate="onLinkNavigate"
      >
        {{ text }}
      </AppLink>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { byAuthorized, rightSide, leftSide } from '@/config/main-menu'
import { useLogged } from '@/composables/useLogged'
import AppLink from './AppLink.vue'
import Logo from './Logo.vue'

const { isLogged } = useLogged()

const right = computed(() => {
  return rightSide.filter(byAuthorized(isLogged.value))
})

const left = computed(() => {
  return leftSide.filter(byAuthorized(isLogged.value))
})

const onLinkNavigate = (navigate: () => void) => {
  navigate()
}
</script>
<style scoped lang="scss">
.navigation-menu {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;

  &__items {
    display: flex;
    gap: rem(25);
  }
  & ._left {
    justify-content: flex-start;
  }
  & ._right {
    justify-content: flex-end;
  }
}
</style>

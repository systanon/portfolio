<template>
  <div class="home-page">
    <h1 class="home-page__title" :style="{ zIndex: zIndex }">
      Serhii Tustanovskyi
    </h1>
    <h2 class="home-page__sub-title">Frontend Developer (Vue.js)</h2>

    <AppLink
      class="home-page__action"
      :to="{ name: 'About' }"
      inactive-class="link-secondary"
      active-class="link-secondary--active"
    >
      <UiButtonIcon
        class="home-page__action-btn"
        iconName="right-arrow-long"
        style="--icon-color-primary: var(--icon-color-secondary)"
      >
        <template #prepend> <span>More About Me</span> </template>
      </UiButtonIcon>
    </AppLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import AppLink from '@/components/AppLink.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'

defineOptions({
  name: 'HomeView',
})

const DEFAULT_Z_INDEX = -4

const zIndex = ref<number>(DEFAULT_Z_INDEX)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const handleMouseMove = (): void => {
  zIndex.value = 10
  if (timeoutId !== null) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    zIndex.value = DEFAULT_Z_INDEX
  }, 500)
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (timeoutId !== null) clearTimeout(timeoutId)
})
</script>

<style scoped lang="scss">
.home-page {
  text-align: center;
  &__title {
    color: var(--text-color-primary);
    text-shadow: $text-shadow;
    position: relative;
  }
  &__sub-title {
    color: var(--text-color-primary);
    text-shadow: $text-shadow;
    padding-bottom: rem(80);
  }
  &__description {
    background-color: var(--bg-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(16);
    margin: 0 auto;
    padding: rem(45);
    max-width: rem(550);
    &-text {
      line-height: rem(35);
      font-size: rem(18);
    }
  }
  &__action-btn {
    background-color: var(--btn-bg-color-primary);
  }
}

@include media-query('tablet') {
  .home-page {
    &__title {
      font-size: rem(150);
    }
    &__sub-title {
      font-size: rem(50);
    }
  }
}
</style>

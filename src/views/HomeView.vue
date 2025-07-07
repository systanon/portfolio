<template>
  <div class="home-page">
    <h1 class="home-page__title" :style="{ zIndex: zIndex }">
      Serhii Tustanovskyi
    </h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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
    position: relative;
  }
}

@include media-query('tablet') {
  .home-page__title {
    font-size: rem(150);
  }
}
</style>

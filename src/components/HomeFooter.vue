<template>
  <div
    class="app-footer"
    :style="{
      '--x': `${x * 20}px`,
      '--y': `${y * 20}px`,
    }"
  >
    <MainFooter />
  </div>
</template>

<script setup lang="ts">
import MainFooter from './MainFooter.vue'

defineProps<{
  x: number
  y: number
}>()
</script>

<style lang="scss" scoped>
.app-footer {
  position: relative;
  &:before {
    background-image: url('@/assets/home-img/layer 1.png');
    content: '';
    position: fixed;
    background-size: cover;
    object-fit: contain;
    background-position: center;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: -4;
  }
}
@include media-query('desktop') {
  .app-footer {
    &:before {
      width: 140%;
      height: 100%;
      left: -15%;
      bottom: -25%;
      transform: translate(var(--x), var(--y));
      transition: transform 0.1s ease-out;
      will-change: transform;
    }
  }
}
</style>

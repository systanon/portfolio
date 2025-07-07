<template>
  <footer
    class="app-footer"
    :style="{
      '--x': `${x * 20}px`,
      '--y': `${y * 20}px`,
    }"
  ></footer>
</template>

<script setup lang="ts">
defineProps<{
  x: number
  y: number
}>()
</script>

<style lang="scss" scoped>
.app-footer {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  &:before {
    background-image: url('@/assets/home-img/layer 1.png');
    content: '';
    position: absolute;
    background-size: cover;
    object-fit: contain;
    background-position: center;
    width: 140%;
    height: 100%;
    z-index: 1;
    left: -15%;
    bottom: -10%;
    transform: translate(var(--x), var(--y));
    transition: transform 0.1s ease-out;
    will-change: transform;
  }
}
</style>

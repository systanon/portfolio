<template>
  <section
    class="default-layout"
    :style="{
      '--x': `${offsetX * 10}px`,
      '--y': `${offsetY * 10}px`,
    }"
  >
    <Comets />
    <AppHeader />
    <main class="default-layout__main">
      <router-view />
    </main>
    <AppFooter :x="offsetX" :y="offsetY" />
  </section>
</template>

<script lang="ts" setup>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import Comets from '@/components/Comets.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const offsetX = ref(0)
const offsetY = ref(0)

function handleMouseMove(event: MouseEvent) {
  const x = (event.clientX / window.innerWidth - 0.5) * 2
  const y = (event.clientY / window.innerHeight - 0.5) * 2
  offsetX.value = x
  offsetY.value = y
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>
<style scoped lang="scss">
.default-layout {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &__main {
    height: 100%;
  }
  &:before {
    content: '';
    position: absolute;
    background-image: url('@/assets/home-img/layer 4.png');
    background-size: cover;
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: -5;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('@/assets/home-img/layer 3.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    z-index: -5;
    transform: translate(var(--x), var(--y));
    transition: transform 0.1s ease-out;
    will-change: transform;
    top: -50%;
  }
}
@include media-query('tablet') {
  .default-layout::after {
    top: 15%;
  }
}
@include media-query('desktop') {
  .default-layout::after {
    top: 10%;
  }
}
@include media-query('large-desktop') {
  .default-layout::after {
    top: 0%;
  }
}
</style>

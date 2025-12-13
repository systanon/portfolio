<template>
  <section
    class="default-layout"
    :style="{
      '--x': `${offsetX * 10}px`,
      '--y': `${offsetY * 10}px`,
    }"
  >
    <Comets v-if="showCommets" />
    <AppHeader />
    <main class="default-layout__main">
      <router-view />
    </main>
    <HomeFooter :x="offsetX" :y="offsetY" />
  </section>
</template>

<script lang="ts" setup>
import HomeFooter from '@/components/HomeFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import Comets from '@/components/Comets.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { delay } from '@/helpers/delay'

const offsetX = ref(0)
const offsetY = ref(0)
const showCommets = ref(false)
let frame: number | null = null

function handleMouseMove(event: MouseEvent) {
  if (frame) return
  frame = requestAnimationFrame(() => {
    offsetX.value = (event.clientX / window.innerWidth - 0.5) * 2
    offsetY.value = (event.clientY / window.innerHeight - 0.5) * 2
    frame = null
  })
}

const showCommetsHandler = async () => {
  await delay(2000)
  showCommets.value = true
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  showCommetsHandler()
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
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
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

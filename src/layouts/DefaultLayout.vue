<template>
  <section
    class="default-layout"
    :style="{
      '--x': `${offsetX * 10}px`,
      '--y': `${offsetY * 10}px`,
    }"
  >
    <Comets v-if="showComets" />
    <AppHeader />
    <main class="default-layout__main">
      <div class="container">
        <router-view />
      </div>
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

defineOptions({
  name: 'DefaultLayout',
})

const offsetX = ref(0)
const offsetY = ref(0)
const showComets = ref(false)
let frame: number | null = null

function handleMouseMove(event: MouseEvent) {
  if (frame) return
  frame = requestAnimationFrame(() => {
    offsetX.value = (event.clientX / window.innerWidth - 0.5) * 2
    offsetY.value = (event.clientY / window.innerHeight - 0.5) * 2
    frame = null
  })
}

const showCometsHandler = async () => {
  await delay(2000)
  showComets.value = true
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  showCometsHandler()
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
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: visible;
  &__main {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('@/assets/home-img/layer 4.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -5;
  }

  &::after {
    content: '';
    top: 17%;
    left: 50%;
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: rem(800);
    max-height: rem(800);
    background-image: url('@/assets/home-img/earth.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transform: translateX(-50%);
    z-index: -5;
  }
}

@include media-query('desktop') {
  .default-layout {
    overflow: hidden;

    &::after {
      transform: translate(var(--x), var(--y)) translateX(-50%);
      transition: transform 0.1s ease-out;
      will-change: transform;
    }
  }
}
</style>

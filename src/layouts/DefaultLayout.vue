<template>
  <section class="default-layout">
    <Comets />
    <AppHeader />
    <img
      class="default-layout__layer-1 layer"
      :style="getStyle(10)"
      src="../assets/home-img/layer 3.png"
      alt="Layer 2"
    />
    <img
      class="default-layout__layer-2 layer"
      :style="getStyle(20)"
      src="../assets/home-img/layer 1.png"
      alt="Layer 3"
    />
    <main class="default-layout__main">
      <router-view />
    </main>
  </section>
</template>

<script lang="ts" setup>
  import AppHeader from '@/components/AppHeader.vue';
  import Comets from '@/components/Comets.vue';
  import { ref, onMounted, onUnmounted } from 'vue';

  const offsetX = ref(0);
  const offsetY = ref(0);

  function handleMouseMove(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    offsetX.value = x;
    offsetY.value = y;
  }

  function getStyle(depth: number) {
    const x = offsetX.value * depth;
    const y = offsetY.value * depth;
    return {
      transform: `translate(${x}px, ${y}px)`,
    };
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
  });
</script>
<style scoped lang="scss">
  .default-layout {
    position: relative;
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
    &__layer-1 {
      top: 0%;
      width: 50%;
      left: 25%;
    }
    &__layer-2 {
      width: 140%;
      left: -15%;
      bottom: -10%;
      object-fit: contain;
    }
  }

  .layer {
    position: absolute;
    background-position: center;
    transition: transform 0.1s ease-out;
    will-change: transform;
    z-index: -3;
  }
</style>

<template>
  <div class="comets-field">
    <div
      v-for="comet in comets"
      :key="comet.id"
      class="comets-field__comet"
      :style="{
        '--angle': comet.angle + 'deg',
        left: comet.left + 'px',
        top: comet.top + 'px',
        animationDelay: comet.delay + 's',
        animationDuration: comet.duration + 's',
        transform: `rotate(${comet.angle}deg)`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';

  type Comet = {
    id: number;
    top: number;
    left: number;
    delay: number;
    duration: number;
    angle: number;
  };

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const comets = ref<Comet[]>([]);
  let cometId = 0;
  let cometInterval: ReturnType<typeof setInterval> | null = null;

  const spawnComet = () => {
    const id = cometId++;
    const left = Math.random() * window.innerWidth * 0.7;
    const top = -100;
    const delay = Math.random() * 0.5;
    const duration = 3 + Math.random() * 2;
    const angle = 35 + Math.random() * 10;

    comets.value.push({ id, top, left, delay, duration, angle });

    setTimeout(() => {
      comets.value = comets.value.filter((c) => c.id !== id);
    }, (delay + duration) * 1000);
  };

  onMounted(() => {
    cometInterval = setInterval(spawnComet, 1800);
  });

  onUnmounted(() => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    if (cometInterval !== null) clearInterval(cometInterval);
  });
</script>

<style scoped lang="scss">
  .comets-field {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -5;
    &__comet {
      position: absolute;
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, white 0%, rgba(255, 255, 255, 0) 70%);
      border-radius: 50%;
      box-shadow: 0 0 15px 6px rgba(255, 255, 255, 0.7);
      filter: drop-shadow(0 0 6px white);
      opacity: 0.9;
      animation-name: comet-fly;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 4px;
        background: linear-gradient(to left, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
        filter: blur(3px);
        border-radius: 2px;

        transform: translate(-100%, -50%);
        transform-origin: left center;

        animation-name: tail-grow-fade;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
        animation-duration: inherit;
        animation-delay: inherit;
      }
    }
  }

  @keyframes comet-fly {
    0% {
      transform: translate(0, 0) rotate(var(--angle));
      opacity: 1;
      box-shadow: 0 0 15px 8px rgba(255, 255, 255, 0.7);
    }
    100% {
      transform: translate(400px, 900px) rotate(var(--angle));
      opacity: 0;
      box-shadow: 0 0 6px 3px rgba(255, 255, 255, 0.2);
    }
  }

  @keyframes tail-grow-fade {
    0% {
      opacity: 1;
      width: 50px;
    }
    100% {
      opacity: 0;
      width: 150px;
    }
  }
</style>

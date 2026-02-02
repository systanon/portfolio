<template>
  <button ref="burgerBtn" class="burger-btn">
    <span ref="line1" class="burger-btn__item" />
    <span ref="line2" class="burger-btn__item" />
    <span ref="line3" class="burger-btn__item" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGsap } from '@/composables/useGsap'

export interface IBurgerButton {
  play: () => void
  reverse: () => void
}

const gsap = useGsap()

const line1 = ref<HTMLSpanElement | null>(null)
const line2 = ref<HTMLSpanElement | null>(null)
const line3 = ref<HTMLSpanElement | null>(null)

let tl: gsap.core.Timeline

const play = () => tl?.play()
const reverse = () => tl?.reverse()

defineExpose({ play, reverse })

onMounted(() => {
  tl = gsap.timeline({ paused: true })
  tl.to(line1.value, { top: '50%', y: '-50%', rotate: 45, duration: 0.2 }, 0)
    .to(line2.value, { opacity: 0, duration: 0.2 }, 0)
    .to(line3.value, { bottom: '50%', y: '50%', rotate: -45, duration: 0.2 }, 0)
})
</script>

<style lang="scss" scoped>
.burger-btn {
  width: rem(32);
  height: rem(24);
  cursor: pointer;
  z-index: 1001;
  position: relative;
  background: none;
  border: none;

  &__item {
    width: 100%;
    height: 100%;
    position: absolute;
    height: rem(3);
    left: 0;
    background: var(--text-color-primary);
    border-radius: rem(2);
    transform-origin: center;
    will-change: transform, opacity;

    &:nth-child(1) {
      top: 0;
    }
    &:nth-child(2) {
      bottom: 50%;
      transform: translateY(50%);
    }
    &:nth-child(3) {
      bottom: 0;
    }
  }
}
</style>

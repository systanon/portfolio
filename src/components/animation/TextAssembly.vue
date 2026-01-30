<template>
  <span ref="charList" v-for="(char, i) in chars" :key="i" class="char">
    {{ char === ' ' ? '\u00A0' : char }}
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, type ComponentPublicInstance } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  text: string
}>()

const charList = ref<ComponentPublicInstance[]>([])

const chars = computed(() => {
  return props.text.split('')
})

onMounted(() => {
  gsap.fromTo(
    charList.value,
    {
      opacity: 0,
      x: () => gsap.utils.random(-300, 300),
      y: () => gsap.utils.random(-200, 200),
      rotation: () => gsap.utils.random(-180, 180),
      scale: () => gsap.utils.random(0.3, 1.8),
      filter: 'blur(12px)',
    },
    {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1.6,
      ease: 'power4.out',
      stagger: {
        each: 0.03,
        from: 'random',
      },
    },
  )
})
</script>

<style scoped>
.char {
  display: inline-block;
  will-change: transform, opacity, filter;
}
</style>

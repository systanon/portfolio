<template>
  <span ref="textSoftReveal">
    {{ text }}
  </span>
</template>

<script lang="ts" setup>
import { gsap } from 'gsap'
import { onMounted, ref, type ComponentPublicInstance } from 'vue'

defineProps<{
  text: string
}>()
const textSoftReveal = ref<ComponentPublicInstance | null>(null)

onMounted(() => {
  gsap.from(textSoftReveal.value, {
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 3,
    ease: 'power4.out',
  })
})
</script>

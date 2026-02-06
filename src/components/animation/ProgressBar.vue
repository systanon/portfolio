<template>
  <div
    :class="['progress-bar', { _progress: progress }]"
    ref="progressBar"
  ></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '@/composables/useGsap'

export interface IProgressBar {
  play: (duration: number, onComplete?: () => void) => void
  reset: () => void
}

const props = withDefaults(
  defineProps<{
    progress?: boolean
  }>(),
  {
    progress: true,
  },
)

const gsap = useGsap()
const progressBar = ref<HTMLDivElement | null>(null)

const play = (durationInSeconds: number, onComplete?: () => void) => {
  const width = props.progress ? '100%' : '0'
  if (!progressBar.value) return
  gsap.killTweensOf(progressBar.value)
  gsap.to(progressBar.value, {
    width,
    duration: durationInSeconds,
    ease: 'linear',
    onComplete,
  })
}

const reset = () => {
  if (!progressBar.value) return
  gsap.killTweensOf(progressBar.value)
  gsap.set(progressBar.value, { width: '0%' })
}

defineExpose({ play, reset })
</script>

<style scoped lang="scss">
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: rem(5);
  background-color: var(--bg-progress-bar);
  width: 100%;
  &._progress {
    width: 0;
  }
}
</style>

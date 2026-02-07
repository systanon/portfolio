<template>
  <div :class="['progress-bar', { _progress: progress }]" ref="progressBar">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGsap } from '@/composables/useGsap'

export interface IProgressBar {
  play: (
    duration: number,
    onComplete?: () => void,
    update?: (tween: gsap.core.Tween) => void,
  ) => void
  reset: () => void
  pause: () => void
  resume: () => void
  seek: () => void
  getTween: () => gsap.core.Tween
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
let tween: gsap.core.Tween | null = null

const pause = () => {
  tween?.pause()
}

const resume = () => {
  tween?.resume()
}

const seek = (progress: number) => {
  tween?.progress(progress)
}

const play = (
  durationInSeconds: number,
  onComplete?: () => void,
  update?: (tween: gsap.core.Tween) => void,
) => {
  const width = props.progress ? '100%' : '0'
  if (!progressBar.value) return
  tween?.kill()
  tween = gsap.to(progressBar.value, {
    width,
    duration: durationInSeconds,
    ease: 'linear',
    onUpdate() {
      if (tween) update?.(tween)
    },
    onComplete,
  })
}

const reset = () => {
  tween?.kill()
  tween = null

  if (!progressBar.value) return
  gsap.set(progressBar.value, { width: '0%' })
}

defineExpose({ play, pause, resume, seek, reset, getTween: () => tween })
</script>

<style scoped lang="scss">
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  max-height: rem(15);
  background-color: var(--bg-progress-bar);
  width: 100%;
  &._progress {
    width: 0;
  }
}
</style>

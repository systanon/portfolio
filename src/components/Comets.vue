<template>
  <div class="comets-field">
    <div
      v-for="comet in comets"
      :key="comet.id"
      class="comets-field__comet"
      :ref="(el) => cometRefs.set(comet.id, el as HTMLElement)"
    >
      <div class="comets-field__tail"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGsap } from '@/composables/useGsap'

type Comet = {
  id: number
  startX: number
  startY: number
  angle: number
  duration: number
}

const gsap = useGsap()
const comets = ref<Comet[]>([])
const cometRefs = new Map<number, HTMLElement>()

let cometId = 0
let cometInterval: ReturnType<typeof setInterval> | null = null
const MAX_COMETS = 3

const spawnComet = () => {
  if (comets.value.length >= MAX_COMETS) return

  const id = cometId++
  const startX = Math.random() * window.innerWidth * 0.8
  const startY = -50
  const angle = 30 + Math.random() * 30
  const duration = 2 + Math.random() * 2

  const comet: Comet = { id, startX, startY, angle, duration }
  comets.value.push(comet)

  requestAnimationFrame(() => animateComet(comet))
}

const animateComet = (comet: Comet) => {
  const element = cometRefs.get(comet.id)
  if (!element) return

  const tail = element.querySelector<HTMLElement>('.comets-field__tail')

  gsap.set(element, {
    x: comet.startX,
    y: comet.startY,
    rotation: comet.angle,
  })

  if (tail) {
    gsap.set(tail, {
      width: 0,
      opacity: 0.8,
      scaleX: 1,
      transformOrigin: 'right center',
      xPercent: -100,
    })
  }

  const tl = gsap.timeline({
    onComplete: () => {
      comets.value = comets.value.filter((c) => c.id !== comet.id)
      cometRefs.delete(comet.id)
    },
  })

  const distance = 800 + Math.random() * 200
  const rad = (comet.angle * Math.PI) / 180
  const targetX = comet.startX + Math.cos(rad) * distance
  const targetY = comet.startY + Math.sin(rad) * distance

  tl.to(
    element,
    {
      x: targetX,
      y: targetY,
      duration: comet.duration,
      ease: 'power1.in',
    },
    0,
  )

  if (tail) {
    tl.to(
      tail,
      {
        width: 150 + Math.random() * 100,
        opacity: 0,
        duration: comet.duration,
        ease: 'power1.in',
      },
      0,
    )
  }
}

onMounted(() => {
  cometInterval = setInterval(spawnComet, 1600)
})

onUnmounted(() => {
  if (cometInterval) clearInterval(cometInterval)
})
</script>

<style scoped lang="scss">
.comets-field {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: -5;

  &__comet {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.8);
  }

  &__tail {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 2px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.9)
    );
    pointer-events: none;
  }
}
</style>

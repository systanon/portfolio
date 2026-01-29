<template>
  <div class="home-page">
    <h2 class="home-page__sub-title">Frontend Developer (Vue.js)</h2>
    <h1 class="home-page__title" :style="{ zIndex: zIndex }">
      Serhii Tustanovskyi
    </h1>

    <section class="home-page__tech">
      <h2 class="home-page__tech-title">My common stack</h2>
      <div class="home-page__tech-info">
        <Card
          ref="items"
          v-for="(tech, index) in techStack"
          :key="index"
          class="pulse-item"
          :icon-name="tech.icon"
          :width="tech.width"
          :height="tech.height"
        >
          <h2>
            {{ tech.text }}
            <UiIcon
              v-if="tech.hasIcon"
              name="arrow"
              color="tertiary"
              size="medium"
            />
          </h2>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, type ComponentPublicInstance } from 'vue'
import Card from '@/components/Card.vue'
import UiIcon from '@/components/ui/icons/UiIcon.vue'
import { gsap } from 'gsap'

defineOptions({
  name: 'HomeView',
})
type Tech = {
  icon: string
  text: string
  width: number
  height: number
  hasIcon?: boolean
}
const techStack: Tech[] = [
  {
    icon: 'vue-logo',
    text: 'Vue.js',
    width: 40,
    height: 35,
  },
  {
    icon: 'typescript-logo',
    text: 'TypeScript',
    width: 55,
    height: 35,
  },
  {
    icon: 'golang-logo',
    text: 'Golang',
    width: 96,
    height: 35,
  },
  {
    icon: 'person-logo',
    text: 'About me',
    width: 35,
    height: 35,
    hasIcon: true,
  },
]

const items = ref<ComponentPublicInstance[]>([])

const DEFAULT_Z_INDEX = -4

const zIndex = ref<number>(DEFAULT_Z_INDEX)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const handleMouseMove = (): void => {
  zIndex.value = 10
  if (timeoutId !== null) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    zIndex.value = DEFAULT_Z_INDEX
  }, 500)
}

const cardPulse = () => {
  const pulseTimes = 3
  const delay = 2
  const tl = gsap.timeline({
    repeat: -1,
  })
  items.value.forEach((card: ComponentPublicInstance) => {
    const el = card.$el
    const pulseTimeline = gsap.timeline()
    pulseTimeline
      .to(el, {
        scale: 1.1,
      })
      .to(el, {
        boxShadow: '0px 0px 41px 11px rgba(62, 203, 252, 0.5)',
        duration: 0.3,
        ease: 'power1.inOut',
        repeat: pulseTimes * 2 - 1,
        yoyo: true,
      })
      .to(el, {
        scale: 1,
        ease: 'power1.inOut',
      })
    tl.add(pulseTimeline, `+=${delay}`)
  })
}

onMounted(() => {
  cardPulse()
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  if (timeoutId !== null) clearTimeout(timeoutId)
})
</script>

<style scoped lang="scss">
.home-page {
  text-align: center;
  &__title {
    color: var(--text-color-primary);
    position: relative;
    padding-bottom: rem(100);
  }
  &__sub-title {
    padding-top: rem(43);
    padding-bottom: rem(25);
    color: var(--text-color-secondary);
  }
  &__description {
    background-color: var(--bg-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(16);
    margin: 0 auto;
    padding: rem(45);
    max-width: rem(550);
    &-text {
      line-height: rem(35);
      font-size: rem(18);
    }
  }
  &__action-btn {
    background-color: var(--btn-bg-color-primary);
  }
  &__tech-title {
    padding-bottom: rem(70);
  }
  &__tech-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: rem(15);
  }
}
@include media-query('tablet') {
  .home-page {
    &__title {
      font-size: rem(110);
    }
    &__sub-title {
      font-size: rem(45);
    }
  }
}
</style>

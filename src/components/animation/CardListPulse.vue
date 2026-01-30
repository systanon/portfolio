<template>
  <div class="card-list">
    <Card
      ref="items"
      v-for="(tech, index) in techList"
      :key="index"
      class="pulse-item"
      :icon-name="tech.icon"
      :isHover="isLast(index)"
      :width="tech.width"
      :height="tech.height"
      @click="isLast(index) && router.push({ name: 'About' })"
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
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import UiIcon from '@/components/ui/icons/UiIcon.vue'
import { gsap } from 'gsap'
import { onMounted, ref, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'

export type Tech = {
  icon: string
  text: string
  width: number
  height: number
  hasIcon?: boolean
}

const props = defineProps<{
  techList: Tech[]
}>()
const router = useRouter()
const items = ref<ComponentPublicInstance[]>([])

const isLast = (index: number) => {
  return index === props.techList.length - 1
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
})
</script>

<style scoped lang="scss">
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: rem(15);
}
</style>

<template>
  <nav class="social-links" aria-label="Social Links">
    <a
      v-for="({ icon, href, label, external }, index) in links"
      :key="index"
      :href="href"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener noreferrer' : undefined"
      class="social-links__item"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      :aria-label="label"
    >
      <UIIcon :name="icon" color="secondary" />
    </a>
  </nav>
</template>

<script lang="ts" setup>
import UIIcon from '@/components/ui/icons/UiIcon.vue'
import type { SocialLink } from '@/types/social-links.type'
import { useGsap } from '@/composables/useGsap'

defineProps<{
  links: SocialLink[]
}>()

const gsap = useGsap()

const onEnter = (e: MouseEvent) => {
  gsap.to(e.currentTarget, {
    scale: 1.2,
    duration: 0.25,
    ease: 'power2.out',
  })
}

const onLeave = (e: MouseEvent) => {
  gsap.to(e.currentTarget, {
    scale: 1,
    duration: 0.25,
    ease: 'power2.out',
  })
}
</script>

<style lang="scss" scoped>
.social-links {
  display: flex;
  gap: rem(20);
}
</style>

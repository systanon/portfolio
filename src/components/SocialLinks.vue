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
import { createIcon } from '@/animations'

defineProps<{
  links: SocialLink[]
}>()

const { onEnter, onLeave } = createIcon()
</script>

<style lang="scss" scoped>
.social-links {
  display: flex;
  gap: rem(20);
}
</style>

<template>
  <nav class="social-links" aria-label="Social Links">
    <a
      v-for="link in links"
      :key="link.icon"
      :href="link.href"
      target="_blank"
      rel="noopener"
      class="social-links__item"
      :aria-label="link.label"
    >
      <UIIcon :name="link.icon" />
    </a>
  </nav>
</template>

<script lang="ts" setup>
import UIIcon from '@/components/ui/icons/UiIcon.vue'
import type { SocialLink } from '@/types/social-links.type'

defineProps<{
  links: SocialLink[]
}>()
</script>

<style lang="scss" scoped>
.social-links {
  display: flex;
  flex-direction: column;
  gap: rem(20);
  &__item {
    display: inline-flex;
    width: 2rem;
    height: 2rem;
    color: var(--text-color-primary);
  }
}

@include media-query('tablet') {
  .social-links {
    flex-direction: row;
  }
}
</style>

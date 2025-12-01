<template>
  <nav class="social-links" aria-label="Social Links">
    <a
      v-for="item in items"
      :key="item.icon"
      :href="item.href"
      target="_blank"
      rel="noopener"
      class="social-links__item"
      :aria-label="item.label"
    >
      <UIIcon :name="item.icon" />
    </a>
  </nav>
</template>

<script lang="ts" setup>
import UIIcon from '@/components/ui/icons/UiIcon.vue'

export type SocialItem = {
  icon: string
  href: string
  label: string
}

const items: SocialItem[] = [
  { icon: 'telegram', href: 'https://t.me/your', label: 'Telegram' },
  { icon: 'linkedin', href: 'https://linkedin.com/in/your', label: 'LinkedIn' },
  { icon: 'whatsapp', href: 'https://wa.me/your', label: 'WhatsApp' },
]
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

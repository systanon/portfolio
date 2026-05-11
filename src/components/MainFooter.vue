<template>
  <footer class="main-footer">
    <div class="container">
      <div class="main-footer__info">
        <SocialLinks class="main-footer__info-links" :links="socialLinks" />
        <p class="main-footer__info-copyright">
          © {{ new Date().getFullYear() }} Tustanovskyi.
          {{ t('footer.copyright') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'
import { socialLinks } from '@/config/social-links'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.main-footer {
  padding: rem(20) 0;
  margin-top: rem(20);
  background-color: var(--bg-primary);
  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: rem(25);
  }
}

@include media-query('tablet') {
  .main-footer {
    &__info {
      flex-direction: row;
      justify-content: space-between;
    }

    &__info-copyright {
      order: 1;
    }

    &__info-links {
      order: 2;
    }
  }
}
</style>

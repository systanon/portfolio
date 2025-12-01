<template>
  <footer class="main-footer">
    <div class="container">
      <div class="main-footer__info">
        <SocialLinks class="main-footer__info-links" />
        <p class="main-footer__info-copyright">
          © 2025 Tustanovskyi. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'
</script>

<style lang="scss" scoped>
.main-footer {
  padding: rem(20) 0;
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

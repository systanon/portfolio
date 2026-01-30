<template>
  <section class="account-layout">
    <AppHeader />
    <main class="account-layout__main">
      <div class="container">
        <router-view />
      </div>
    </main>
    <MainFooter />
  </section>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue'
import MainFooter from '@/components/MainFooter.vue'
</script>
<style scoped lang="scss">
.account-layout {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  &__main {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &:before {
    content: '';
    position: fixed;
    background-image: url('@/assets/home-img/space.webp');
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
</style>

<template>
  <section class="todo-layout">
    <AppHeader />
    <main class="todo-layout__main">
      <div class="container">
        <router-view />
      </div>
    </main>
  </section>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue'
</script>
<style scoped lang="scss">
.todo-layout {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &__main {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
  }
  &:before {
    content: '';
    position: absolute;
    background-image: url('@/assets/home-img/layer 4.png');
    background-size: cover;
    object-fit: cover;
    width: 100%;
    height: 100%;
    z-index: -5;
  }
}
</style>

<template>
  <div ref="note" class="note-item">
    <div class="note-item__info">
      <h2 class="note-item__title">{{ note.title }}</h2>
      <p class="note-item__description">{{ note.description }}</p>
    </div>
    <div class="note-item__menu">
      <UiButtonIcon
        class="note-item__menu-open"
        iconName="arrow-up-left"
        @click="toggleMenu"
      />
      <div v-if="menuOpen" class="note-item__menu-actions">
        <UiButtonIcon
          class="note-item__menu-item"
          style="--i: 2"
          iconName="edit"
          @click="$emit('editHandler', note)"
        />
        <UiButtonIcon
          class="note-item__menu-item"
          style="--i: 1"
          iconName="trash"
          @click="$emit('deleteHandler', note)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Note } from '@/types/notes'
import { ref, type Ref } from 'vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
defineProps<{
  note: Note
}>()

const menuOpen: Ref<boolean> = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
</script>

<style scoped lang="scss">
.note-item {
  position: relative;
  padding: rem(15) rem(30) rem(15) rem(15);
  border-radius: 1rem;
  border: var(--todo-checked) solid 1px;
  display: flex;
  gap: 1rem;
  width: 30rem;
  height: 10rem;
  background-color: var(--bg-primary);
  color: var(--text-color-secondary);
  overflow: hidden;
  &__info {
    flex: 1 1;
  }
  &__menu {
    position: absolute;
    bottom: 0;
    right: 0;
    &-open {
      position: relative;
      z-index: 2;
    }
    &:before {
      content: '';
      position: absolute;
      width: 200%;
      height: 200%;
      border-radius: 50%;
      background: $bg-menu-secondary;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    &-actions {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      z-index: 1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: $bg-menu-tertiary;
      border-radius: 50%;
    }
    &-item {
      --angle: calc(var(--i) * 150deg);
      position: absolute;
      top: 18%;
      left: 16%;
      transform: rotate(var(--angle)) translate(2rem)
        rotate(calc(var(--angle) * -1));
      transition: transform 0.3s ease;
      z-index: 10;
    }
  }
  :deep(.ui-icon) {
    color: $icon-color-primary;
  }
}
</style>

<template>
  <div ref="note" class="note-item">
    <div class="note-item__info">
      <h2 class="note-item__title">{{ note.title }}</h2>
      <p class="note-item__description">{{ note.description }}</p>
    </div>
    <div ref="menuRef" :class="['note-item__menu', { _open: menuOpen }]">
      <UiButtonIcon
        :class="['note-item__menu-btn', { _open: menuOpen }]"
        iconName="arrow-up-left"
        :btnHover="false"
        iconHover
        style="--icon-hover-primary: var(--icon-hover-secondary)"
        @click="toggleMenu"
      />

      <div class="note-item__menu-actions">
        <UiButtonIcon
          class="note-item__menu-item"
          iconName="edit"
          :btnHover="false"
          iconHover
          style="--icon-hover-primary: var(--icon-hover-secondary)"
          @click="$emit('edit', note)"
        />
        <UiButtonIcon
          class="note-item__menu-item"
          iconName="trash"
          :btnHover="false"
          iconHover
          style="--icon-hover-primary: var(--icon-hover-secondary)"
          @click="$emit('delete', note)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Note } from '@/types/notes'
import { ref, type Ref } from 'vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import { onClickOutside } from '@vueuse/core'

defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  (e: 'edit', todo: Note): void
  (e: 'delete', todo: Note): void
}>()

const menuOpen: Ref<boolean> = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const toggleMenu = () => (menuOpen.value = !menuOpen.value)
onClickOutside(menuRef, () => (menuOpen.value = false))
</script>

<style scoped lang="scss">
.note-item {
  position: relative;
  padding: rem(15) rem(60) rem(15) rem(15);
  border-radius: rem(16);
  border: var(--todo-checked) solid 1px;
  display: flex;
  gap: rem(16);
  width: 100%;
  height: rem(250);
  background-color: var(--bg-primary);
  color: var(--text-color-secondary);
  overflow: hidden;

  &__info {
    flex: 1 1;
  }

  &__menu {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    transform: translateX(70%);
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    gap: rem(50);
    background-color: var(--bg-tertiary);
    &-btn {
      :deep(.ui-icon) {
        transition: transform 0.3s ease;
        transform: rotate(-45deg);
      }
      &._open {
        :deep(.ui-icon) {
          transform: rotate(135deg);
        }
      }
    }
    &._open {
      transform: translateX(0);
    }

    &-actions {
      display: flex;
      flex-direction: column;
      gap: rem(16);
    }
  }
  :deep(.ui-icon) {
    color: var(--icon-color-secondary);
  }
  :deep(._icon-hover) {
    &:hover {
      color: var(--icon-hover-secondary);
    }
  }
}
</style>

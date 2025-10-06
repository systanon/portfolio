<template>
  <div ref="todo" :class="['todo-item', { _checked: todo.completed }]">
    <div class="todo-item__checked">
      <input
        type="checkbox"
        :checked="todo.completed"
        @input="
          $emit('completeHandler', {
            id: todo.id,
            payload: { completed: !todo.completed },
          })
        "
      />
    </div>
    <div class="todo-item__info">
      <h2 class="todo-item__title">
        <UiLittleKip :text="todo.title" />
      </h2>
      <div class="todo-item__description">
        <p class="todo-item__description-text">{{ todo.description }}</p>
      </div>
    </div>
    <div class="todo-item__menu">
      <UiButtonIcon
        class="todo-item__menu-open"
        iconName="arrow-up-left"
        @click="toggleMenu"
      />
      <div v-if="menuOpen" class="todo-item__menu-actions">
        <UiButtonIcon
          class="todo-item__menu-item"
          style="--i: 2"
          iconName="edit"
          @click="$emit('editHandler', todo)"
        />
        <UiButtonIcon
          class="todo-item__menu-item"
          style="--i: 1"
          iconName="trash"
          @click="$emit('deleteHandler', todo)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Todo } from '@/types/todo'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import { defineProps, ref, type Ref } from 'vue'
import UiLittleKip from '@/components/ui/UiLittleKip.vue'
defineProps<{
  todo: Todo
}>()

const menuOpen: Ref<boolean> = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
</script>

<style scoped lang="scss">
.todo-item {
  position: relative;
  padding: rem(15) rem(30) rem(15) rem(15);
  border-radius: 1rem;
  border: transparent solid 1px;
  display: flex;
  gap: 1rem;
  width: 30rem;
  height: 10rem;
  background-color: var(--bg-primary);
  color: var(--text-color-secondary);
  overflow: hidden;
  &__checked {
    display: flex;
    align-items: center;
    flex: 0 0;
  }
  &__info {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: calc(100% - 0.9375rem);
  }
  &__description {
    flex: 1 1 auto;
    overflow-y: auto;
    width: calc(100% - 4rem);
  }
  &__description-text {
    @include break-long-words;
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

  &._checked {
    border-color: var(--todo-checked);
  }
  :deep(.ui-icon) {
    color: $icon-color-primary;
  }
}
</style>

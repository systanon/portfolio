<template>
  <div ref="todo" class="todo-item">
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
      <h2 class="todo-item__title">{{ todo.title }}</h2>
      <p class="todo-item__description">{{ todo.description }}</p>
    </div>
    <div class="todo-item__actions">
      <button @click="$emit('editHandler', todo)">edit</button>
      <button @click="$emit('deleteHandler', todo)">remove</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Todo } from "@/types/todo";
import { defineProps } from "vue";
defineProps<{
  todo: Todo;
}>();
</script>

<style scoped lang="scss">
.todo-item {
  box-sizing: border-box;
  padding: 4rem;
  border-radius: 2rem;
  border: black solid 1px;
  display: flex;
  gap: 1rem;
  width: 30rem;
  min-height: 10rem;
  &__checked {
    display: flex;
    align-items: center;
    flex: 0 0;
  }
  &__info {
    flex: 1 1;
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 0 0;
  }
  &__title {
    margin: 0;
  }
}
</style>

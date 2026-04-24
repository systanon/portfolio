<template>
  <div class="todo-page">
    <h2 class="todo-page__title">Todo details</h2>
    <template v-if="todo">
      <TodoDetail :todo="todo" />
    </template>
    <template v-else>
      <p>not found</p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { AppError } from '@/types/app-errors'
import TodoDetail from '@/components/TodoDetail.vue'
import type { Todo } from '@/types/todo'
import { useTodo } from '@/composables/useTodo'
const { getOne } = useTodo()

const route = useRoute()
const todo = ref<Todo | null>(null)

async function fetchTodo(id: number) {
  const result = await getOne(id)
  todo.value = result instanceof AppError ? null : result.data
}

watch(
  () => route.params.id,
  (id) => fetchTodo(Number(id)),
  { immediate: true },
)
</script>

<style scoped lang="scss">
.todo-page {
  &__title {
    padding-bottom: rem(50);
    text-align: center;
  }
}
</style>

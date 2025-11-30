<template>
  <div class="todo-page">
    <h2 class="todo-page__title">Todo details</h2>
    <template v-if="todo">
      <TodoDelail :todo="todo" />
    </template>
    <template v-else>
      <p>not found</p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { application } from '@/application'
import { AppError } from '@/types/app-errors'
import TodoDelail from '@/components/TodoDelail.vue'
import type { Todo } from '@/types/todo'
export default defineComponent({
  components: {
    TodoDelail,
  },
  data() {
    return {
      todo: null as Todo | null,
    }
  },
  async beforeRouteEnter(to, _, next) {
    const id = Number(to.params.id)
    const todo = await application.getOneTodo(id)
    if (todo instanceof AppError) {
      next((vm: any) => vm.setTodo(null))
    } else {
      next((vm: any) => vm.setTodo(todo))
    }
  },
  async beforeRouteUpdate(to, _) {
    const id = Number(to.params.id)
    this.todo = null
    const todo = await application.getOneTodo(id)
    todo instanceof AppError ? this.setTodo(null) : this.setTodo(todo)
  },
  methods: {
    setTodo(todo: Todo | null) {
      this.todo = todo
    },
  },
})
</script>

<style scoped lang="scss">
.todo-page {
  &__title {
    padding-bottom: rem(50);
    text-align: center;
  }
}
</style>

<template>
  <h2>This is Todos page</h2>
  <section class="todos-view">
  <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
  <p v-if="!todos.length">Epmty todos</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTodoStore } from "@/plugins/store/todos";
import TodoItem from "@/components/TodoItem.vue";
const todoStore = useTodoStore();
const { todos } = storeToRefs(todoStore);
const { init } = todoStore;

onMounted(init);
</script>

<style scoped lang="scss">
.todos-view {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
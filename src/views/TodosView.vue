<template>
  <h1>This is Todos page</h1>
  <ul v-if="todos.length">
    <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
  </ul>
  <p v-else>Epmty todos</p>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTodoStore } from "@/plugins/store/todos";

const todoStore = useTodoStore();
const { todos } = storeToRefs(todoStore);
const { init } = todoStore;

onMounted(init);
</script>
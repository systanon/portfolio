<template>
  <h2>This is Todos page</h2>
  <button @click="createHandler">Create Todo</button>
  <section class="page-todo__todos">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @editHandler="editHandler"
      @deleteHandler="deleteHandler"
    />
    <p v-if="!todos.length">Epmty todos</p>
  </section>

  <UIModal ref="deleteModalRef" title="Delete todo?" class="page-todo__modal">
    <template #default>
      <div class="page-todo__modal-form delete-todo-form">
        <h3>Are you sure you want to delete todo?</h3>
      </div>
    </template>
  </UIModal>
  <UIModal ref="editModalRef" title="Update todo" class="page-todo__modal">
    <template #default>
      <div class="page-todo__modal-form update-todo-form">
        <h3>Edit todo</h3>
        <input type="text" v-model="todo.title" />
        <input type="text" v-model="todo.description" />
      </div>
    </template>
  </UIModal>
    <UIModal ref="createModalRef" title="Create Todo" class="page-todo__modal">
    <template #default>
      <div class="page-todo__modal-form update-todo-form">
        <h3>Create todo</h3>
        <input type="text" v-model="todo.title" />
        <input type="text" v-model="todo.description" />
        <input type="checkbox" v-model="todo.completed" />
      </div>
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useTodoStore } from "@/plugins/store/todos";
import TodoItem from "@/components/TodoItem.vue";
import UIModal, { type IModalOpen } from "@/components/UIModal.vue";
import {
  type UpdateTodoDTO,
  type ReplaceTodoDTO,
  type Todo,
} from "../types/todo";

const todo = reactive({
  title: "",
  description: "",
  completed: false,
} as ReplaceTodoDTO);

const deleteModalRef = ref<IModalOpen | null>(null);
const editModalRef = ref<IModalOpen | null>(null);
const createModalRef = ref<IModalOpen | null>(null);

const todoStore = useTodoStore();
const { todos } = storeToRefs(todoStore);
const { init } = todoStore;

const deleteHandler = async (todo: Todo) => {
  const { id } = todo;
  const modal = deleteModalRef.value;
  const res = await modal?.open();
  if (res) console.log(id);
};

const editHandler = async (_todo: Todo) => {
  const { id } = _todo;
  fillInputs(_todo);
  const modal = editModalRef.value;
  const res = await modal?.open();
  if (res) {
   console.log(todo)
  }
  clearInputs();
};

const createHandler = async () => {
  const modal = createModalRef.value;
  const res = await modal?.open();
  if (res) {
   console.log(todo)
  }
  clearInputs();
};

const clearInputs = () => {
  todo.title = "";
  todo.description = "";
  todo.completed = false;
};

const fillInputs = (_todo: UpdateTodoDTO) => {
  todo.title = _todo.title ?? "";
  todo.description = _todo.description ?? "";
  todo.completed = _todo.completed ?? false;
};

onMounted(init);
</script>

<style scoped lang="scss">
.page-todo {
  &__todos {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  &__modal-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 40vw;
    min-width: 400px;
    max-width: 600px;
  }
}
</style>
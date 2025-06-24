<template>
  <section class="page-todo">
    <h2 class="page-todo__title">This is Todos page</h2>
    <UiButtonIcon class="page-todo__create" iconName="plus" @click="createHandler" />
    <section class="page-todo__todos">
      <TodoItem
        v-for="[id, todo] of [...todosMap.entries()]"
        :key="id"
        :todo="todo"
        @editHandler="editHandler"
        @deleteHandler="deleteHandler"
        @completeHandler="completeHandler"
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

    <UIPagination
      class="page-todo__pagination"
      v-model:page="pagination.page"
      v-model:pages="pagination.pages"
      @first-page="firstPage"
      @prev-page="prevPage"
      @next-page="nextPage"
      @latest-page="latestPage"
      @btn-page="btnPage"
    />
  </section>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, computed, watch } from 'vue';
  import { APP_CONFIG } from '@/constants';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useTodoStore } from '@/plugins/store/todos';
  import TodoItem from '@/components/TodoItem.vue';
  import { usePagination } from '@/hooks/pagination';
  import UIPagination from '@/components/UiPagination.vue';
  import UiButtonIcon from '@/components/UiButtonIcon.vue';

  import UIModal, { type IModalOpen } from '@/components/UiModal.vue';
  import { type UpdateTodoDTO, type ReplaceTodoDTO, type Todo } from '../types/todo';

  const todo = reactive({
    title: '',
    description: '',
    completed: false,
  } as ReplaceTodoDTO);

  const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = APP_CONFIG;

  const deleteModalRef = ref<IModalOpen | null>(null);
  const editModalRef = ref<IModalOpen | null>(null);
  const createModalRef = ref<IModalOpen | null>(null);

  const route = useRoute();
  const router = useRouter();

  const todoStore = useTodoStore();
  const { pagination, firstPage, prevPage, nextPage, latestPage, btnPage, setPages } =
    usePagination(DEFAULT_PAGE_SIZE);
  const { todos, todosMap, pages } = storeToRefs(todoStore);
  const { getAll, update, create, remove } = todoStore;

  const requestParams = computed(() => {
    const { perPage, page } = pagination;
    return {
      perPage,
      page,
    };
  });

  const deleteHandler = async (todo: Todo) => {
    const { id } = todo;
    const modal = deleteModalRef.value;
    const res = await modal?.open();
    if (res) remove(id);
  };

  const editHandler = async (_todo: Todo) => {
    const { id } = _todo;
    fillInputs(_todo);
    const modal = editModalRef.value;
    const res = await modal?.open();
    if (res) {
      update(id, todo);
    }
    clearInputs();
  };

  const parsePouterQuery = () => {
    const { page, perPage } = route.query;
    pagination.page = Number(page) || DEFAULT_PAGE;
    pagination.perPage = Number(perPage) || DEFAULT_PAGE_SIZE;
  };

  const saveRouterQuery = () => {
    const query = { ...route.query, ...requestParams.value };
    router.replace({ query });
  };

  const createHandler = async () => {
    const modal = createModalRef.value;
    const res = await modal?.open();
    if (res) {
      create(todo);
    }
    clearInputs();
  };

  const completeHandler = ({ id, payload }: { id: number; payload: UpdateTodoDTO }) => {
    update(id, payload);
  };

  const clearInputs = () => {
    todo.title = '';
    todo.description = '';
    todo.completed = false;
  };

  const fillInputs = (_todo: UpdateTodoDTO) => {
    todo.title = _todo.title ?? '';
    todo.description = _todo.description ?? '';
    todo.completed = _todo.completed ?? false;
  };

  watch(
    pages,
    (pages) => {
      if (!pages) return;
      setPages(pages);
    },
    { immediate: true },
  );
  watch(
    requestParams,
    (params) => {
      getAll(params);
      saveRouterQuery();
    },
    { immediate: true },
  );

  onMounted(() => {
    parsePouterQuery();
    getAll(requestParams.value);
  });
</script>

<style scoped lang="scss">
  .page-todo {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr 0.5fr;
    &__title {
      text-align: center;
    }
    &__todos {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: center;
      height: 100%;
      overflow-y: scroll;
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

  @include media-query('large-desktop') {
    .page-todo {
      display: grid;
      gap: 30px;
      grid-template-columns: repeat(12, 1fr);
      &__title {
        grid-column: 1/ -1;
      }
      &__create {
        grid-column: 1/ -1;
      }
      &__todos {
        grid-column: 2/ 12;
      }
      &__pagination {
        grid-column: 1/ -1;
      }
    }
  }
</style>

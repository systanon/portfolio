<template>
  <section class="page-todo">
    <h2 class="page-todo__title">This is Todos page</h2>
    <UiButtonIcon
      class="page-todo__create"
      iconName="plus"
      @click="openCreateForm"
    >
      <template #prepend>
        <span class="page-todo__create-text"> Create todo </span>
      </template>
    </UiButtonIcon>

    <section class="page-todo__todos">
      <TodoItem
        v-for="[id, todo] of [...todosMap.entries()]"
        :key="id"
        :todo="todo"
        @edit="openEditForm"
        @delete="deleteHandler"
        @toggle="completeHandler"
        @detail="detailHandler"
      />
      <p v-if="!todos.length">Epmty todos</p>
    </section>

    <UIModal ref="deleteModalRef" title="Delete todo?" class="page-todo__modal">
      <template #default>
        <div class="page-todo__modal-form delete-todo-form">
          <h3>Are you sure you want to delete todo?</h3>
        </div>
      </template>
      <template #actions="{ close, confirm }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="confirm" label="Delete todo" />
      </template>
    </UIModal>
    <UIModal ref="editModalRef" title="Update Todo">
      <TodoForm
        ref="editFormRef"
        :title="editingTodo?.title"
        :description="editingTodo?.description"
      />
      <template #actions="{ close }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="updateTodo" label="Update todo" />
      </template>
    </UIModal>

    <UIModal ref="createModalRef" title="Create Todo">
      <TodoForm ref="createFormRef" />

      <template #actions="{ close }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="createTodo" label="Create todo" />
      </template>
    </UIModal>

    <UiPaginationMobile
      v-if="isMobile || isTablet"
      v-model:page="pagination.page"
      v-model:pages="pagination.pages"
      @prev-page="prevPage"
      @next-page="nextPage"
    />
    <UIPagination
      v-else
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
import { onMounted, ref, computed, watch } from 'vue'
import { APP_CONFIG } from '@/constants'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/plugins/store/todos'
import TodoItem from '@/components/TodoItem.vue'
import { usePagination } from '@/hooks/pagination'
import UIPagination from '@/components/ui/UiPagination.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import TodoForm from '@/components/forms/TodoForm.vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import { type Todo } from '../types/todo'
import { AppError } from '@/types/app-errors'
import UiPaginationMobile from '@/components/ui/UiPaginationMobile.vue'
import { useInjectWindowResize } from '@/composables/useWindowResize'
import type { RouteName } from '@/types/router'

defineOptions({
  name: 'TodosView',
})

const createFormRef = ref()
const editFormRef = ref()
const editingTodo = ref<Todo | undefined>(undefined)

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = APP_CONFIG

const deleteModalRef = ref<IModalOpen | null>(null)
const editModalRef = ref<IModalOpen | null>(null)
const createModalRef = ref<IModalOpen | null>(null)

const { isMobile, isTablet } = useInjectWindowResize()

const route = useRoute()
const router = useRouter()

const detailHandler = (id: number) => {
  router.push({
    name: 'TodoDetail' satisfies RouteName,
    params: { id },
  })
}

const todoStore = useTodoStore()

const {
  pagination,
  firstPage,
  prevPage,
  nextPage,
  latestPage,
  btnPage,
  setPages,
} = usePagination(DEFAULT_PAGE_SIZE)
const { todos, todosMap, pages } = storeToRefs(todoStore)
const { getAll, update, create, remove, completedToggler } = todoStore

const requestParams = computed(() => {
  const { perPage, page } = pagination
  return {
    perPage,
    page,
  }
})

const openEditForm = async (todo: Todo) => {
  editingTodo.value = todo
  await editModalRef.value?.open()
  editingTodo.value = undefined
}

const openCreateForm = () => {
  createModalRef.value?.open()
}

const createTodo = async () => {
  const modal = createModalRef.value
  const data = await createFormRef.value?.submit()
  if (!data) return

  const res = await create(data)
  if (!(res instanceof AppError)) getAll(requestParams.value)

  modal?.confirm(true)
}

const updateTodo = async () => {
  const modal = editModalRef.value
  const data = await editFormRef.value?.submit()
  const id = editingTodo?.value?.id
  if (!data && !id) return

  const res = await update(Number(id), data)
  if (!(res instanceof AppError)) getAll(requestParams.value)

  modal?.confirm(true)
}

const deleteHandler = async (todo: Todo) => {
  const { id } = todo
  const modal = deleteModalRef.value
  const res = await modal?.open()
  if (res) {
    const res = await remove(id)
    if (res instanceof AppError) return
    getAll(requestParams.value)
  }
}

const parseRouterQuery = () => {
  const { page, perPage } = route.query
  pagination.page = Number(page) || DEFAULT_PAGE
  pagination.perPage = Number(perPage) || DEFAULT_PAGE_SIZE
}

const saveRouterQuery = () => {
  const query = { ...route.query, ...requestParams.value }
  router.replace({ query })
}

const completeHandler = ({
  id,
  payload,
}: {
  id: number
  payload: { completed: boolean }
}) => {
  completedToggler(id, payload)
}

watch(
  pages,
  (pages) => {
    if (!pages) return
    setPages(pages)
  },
  { immediate: true }
)

watch(requestParams, (params) => {
  getAll(params)
  saveRouterQuery()
})

onMounted(() => {
  parseRouterQuery()
  getAll(requestParams.value)
})
</script>

<style scoped lang="scss">
.page-todo {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
  &__title {
    text-align: center;
  }
  &__create {
    margin: 0 auto;
    background-color: $bg-menu-secondary;
    border-radius: rem(6);
    :deep(.ui-icon) {
      color: var(--icon-color-secondary);
    }
    &-text {
      padding-right: 1rem;
      font-size: 1.5rem;
    }
  }

  &__todos {
    display: grid;
    gap: rem(30);
  }

  &__modal-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
@include media-query('tablet') {
  .page-todo__todos {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

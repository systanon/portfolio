<template>
  <section class="page-todo">
    <h2 class="page-todo__title">This is Todos page</h2>
    <UiButtonIcon
      class="page-todo__create"
      iconName="plus"
      @click="createHandler"
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
        @editHandler="editHandler"
        @deleteHandler="deleteHandler"
        @completeHandler="completeHandler"
        @detailTodo="detailHandler"
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
    <UIModal ref="editModalRef" title="Update todo" class="page-todo__modal">
      <template #default>
        <div class="page-todo__modal-form update-todo-form">
          <h3>Edit todo</h3>
          <UiInput
            v-model="todo.title"
            type="text"
            placeholder="Title"
            :validation="v$.title"
          />
          <UiTextarea
            v-model="todo.description"
            placeholder="Description"
            :validation="v$.description"
          />
        </div>
      </template>
      <template #actions="{ close }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="updateTodo" label="Update todo" />
      </template>
    </UIModal>
    <UIModal ref="createModalRef" title="Create Todo" class="page-todo__modal">
      <template #default>
        <div class="page-todo__modal-form update-todo-form">
          <h3>Create todo</h3>
          <UiInput
            v-model="todo.title"
            type="text"
            placeholder="Title"
            :validation="v$.title"
          />
          <UiTextarea
            v-model="todo.description"
            placeholder="Description"
            :validation="v$.description"
          />
        </div>
      </template>
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
import { onMounted, ref, reactive, computed, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { APP_CONFIG } from '@/constants'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/plugins/store/todos'
import TodoItem from '@/components/TodoItem.vue'
import { usePagination } from '@/hooks/pagination'
import UIPagination from '@/components/ui/UiPagination.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import {
  type UpdateTodoDTO,
  type ReplaceTodoDTO,
  type Todo,
} from '../types/todo'
import UiTextarea from '@/components/ui/fields/UiTextarea.vue'
import { AppError } from '@/types/app-errors'
import UiPaginationMobile from '@/components/ui/UiPaginationMobile.vue'
import { useInjectWindowResize } from '@/composables/useWindowResize'
import type { RouteName } from '@/types/router'
import { useValidationRules } from '@/composables/useValidationRules'

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = APP_CONFIG
const deleteModalRef = ref<IModalOpen | null>(null)
const editModalRef = ref<IModalOpen | null>(null)
const createModalRef = ref<IModalOpen | null>(null)
const { isMobile, isTablet } = useInjectWindowResize()

const route = useRoute()
const router = useRouter()

const todo = reactive({
  title: '',
  description: '',
  completed: false,
} as ReplaceTodoDTO)

const { titleRules, descriptionRules } = useValidationRules()

const rules = {
  title: titleRules,
  description: descriptionRules,
}

const detailHandler = (id: string) => {
  router.push({
    name: 'TodoDetail' satisfies RouteName,
    params: { id },
  })
}

const v$ = useVuelidate(rules, todo)

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

const editHandler = async (_todo: Todo) => {
  fillInputs(_todo)
  router.replace({ query: { ...route.query, id: _todo.id } })
  const modal = editModalRef.value
  await modal?.open()
  const { id, ...restQuery } = route.query
  router.replace({ query: restQuery })
  clearInputs()
  v$.value.$reset()
}
const updateTodo = async () => {
  const id = route.query.id
  const modal = editModalRef.value
  const isValid = await v$.value.$validate()
  if (!isValid || !id) return

  const res = await update(Number(id), todo)
  if (!(res instanceof AppError)) getAll(requestParams.value)
  modal?.confirm(true)
}

const parsePouterQuery = () => {
  const { page, perPage } = route.query
  pagination.page = Number(page) || DEFAULT_PAGE
  pagination.perPage = Number(perPage) || DEFAULT_PAGE_SIZE
}

const saveRouterQuery = () => {
  const query = { ...route.query, ...requestParams.value }
  router.replace({ query })
}

const createHandler = async () => {
  const modal = createModalRef.value
  await modal?.open()
  clearInputs()
  v$.value.$reset()
}

const createTodo = async () => {
  const modal = createModalRef.value
  const isValid = await v$.value.$validate()
  if (!isValid) return

  const res = await create(todo)
  if (!(res instanceof AppError)) getAll(requestParams.value)
  modal?.confirm(true)
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

const clearInputs = () => {
  todo.title = ''
  todo.description = ''
  todo.completed = false
}

const fillInputs = (_todo: UpdateTodoDTO) => {
  todo.title = _todo.title ?? ''
  todo.description = _todo.description ?? ''
  todo.completed = _todo.completed ?? false
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
  parsePouterQuery()
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
      color: $icon-color-primary;
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

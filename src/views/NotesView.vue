<template>
  <section class="page-note">
    <h2 class="page-note__title">This is Notes page</h2>
    <UiButtonIcon
      class="page-note__create"
      iconName="plus"
      @click="openCreateForm"
    />
    <section class="page-note__notes">
      <NoteItem
        v-for="note of notesList"
        :key="note.id"
        :note="note"
        @edit="openEditForm"
        @delete="deleteHandler"
      />

      <p v-if="!notesList.length">Empty notes</p>
    </section>

    <UIModal ref="deleteModalRef" title="Delete note?" class="page-note__modal">
      <template #default>
        <div class="page-note__modal-form delete-note-form">
          <h3>Are you sure you want to delete a note?</h3>
        </div>
      </template>
      <template #actions="{ close, confirm }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="confirm" label="Delete note" />
      </template>
    </UIModal>
    <UIModal ref="editModalRef" title="Update note" class="page-note__modal">
      <ItemForm
        ref="editFormRef"
        :title="editingNote?.title"
        :description="editingNote?.description"
      />
      <template #actions="{ close }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="updateNote" label="Update todo" />
      </template>
    </UIModal>
    <UIModal ref="createModalRef" title="Create Note" class="page-note__modal">
      <ItemForm ref="createFormRef" />
      <template #actions="{ close }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="createNote" label="Create note" />
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
      class="page-note__pagination"
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
import { onMounted, ref, computed, watch, watchEffect } from 'vue'
import { APP_CONFIG } from '@/constants'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNotesStore } from '@/plugins/store/notes'
import NoteItem from '@/components/NoteItem.vue'
import { usePagination } from '@/hooks/pagination'
import UIPagination from '@/components/ui/UiPagination.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import ItemForm from '@/components/forms/ItemForm.vue'
import UiPaginationMobile from '@/components/ui/UiPaginationMobile.vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import { type Note } from '../types/notes'
import { useInjectWindowResize } from '@/composables/useWindowResize'
import { AppError } from '@/types/app-errors'

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = APP_CONFIG

const createFormRef = ref()
const editFormRef = ref()

const deleteModalRef = ref<IModalOpen | null>(null)
const editModalRef = ref<IModalOpen | null>(null)
const createModalRef = ref<IModalOpen | null>(null)

const editingNote = ref<Note | undefined>(undefined)

const { isMobile, isTablet } = useInjectWindowResize()

const route = useRoute()
const router = useRouter()

const notesStore = useNotesStore()
const {
  pagination,
  firstPage,
  prevPage,
  nextPage,
  latestPage,
  btnPage,
  setPages,
} = usePagination(DEFAULT_PAGE_SIZE)
const { notesMap, pages } = storeToRefs(notesStore)
const { getAll, update, create, remove } = notesStore

const requestParams = computed(() => {
  const { perPage, page } = pagination
  return {
    perPage,
    page,
  }
})

const notesList = computed(() => {
  return Array.from(notesMap.value.values())
})

const openEditForm = async (todo: Note) => {
  editingNote.value = todo
  await editModalRef.value?.open()
  editingNote.value = undefined
}

const openCreateForm = () => {
  createModalRef.value?.open()
}

const submitWithModal = async (
  modal: IModalOpen | null,
  action: () => Promise<unknown>
) => {
  const res = await action()
  if (!(res instanceof AppError)) {
    await getAll(requestParams.value)
    modal?.confirm(true)
  }
}

const deleteHandler = async (note: Note) => {
  const { id } = note
  const modal = deleteModalRef.value
  const res = await modal?.open()
  if (res) remove(id)
}

const updateNote = async () => {
  const data = await editFormRef.value?.submit()
  const id = editingNote?.value?.id
  if (!data || !id) return

  await submitWithModal(editModalRef.value, () => update(id as number, data))
}

const createNote = async () => {
  const data = await createFormRef.value?.submit()
  if (!data) return

  await submitWithModal(createModalRef.value, () => create(data))
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

watchEffect(() => {
  if (pages.value) {
    setPages(pages.value)
  }
})

watch(
  requestParams,
  (params) => {
    getAll(params)
    saveRouterQuery()
  },
  { immediate: true }
)

onMounted(() => {
  parsePouterQuery()
})
</script>

<style scoped lang="scss">
.page-note {
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr 0.5fr;
  &__title {
    text-align: center;
  }
  &__create {
    margin: 0 auto;
  }
  &__notes {
    display: flex;
    flex-wrap: wrap;
    gap: rem(30);
    justify-content: center;
    align-content: baseline;
    height: 100%;
    overflow-y: auto;
  }

  &__modal-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

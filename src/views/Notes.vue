<template>
  <section class="page-note">
    <h2 class="page-note__title">{{ t('page_notes.page_title') }}</h2>
    <UiButtonIcon
      class="page-note__create"
      iconName="plus"
      @click="openCreateForm"
    />
    <template v-if="!loading">
      <section class="page-note__notes">
        <NoteItem
          v-for="note of rows"
          :key="note.id"
          :note="note"
          @edit="openEditForm"
          @delete="deleteHandler"
        />

        <p v-if="!rows.length">{{ t('page_notes.empty_notes') }}</p>
      </section>

      <UiPaginationMobile
        v-if="isMobile || isTablet"
        v-model:page="pagination.page"
        v-model:pages="pagination.pages"
        @prev-page="prevPage"
        @next-page="nextPage"
      />
      <UIPagination
        v-else
        class="page-note__pagination"
        v-model:page="pagination.page"
        v-model:pages="pagination.pages"
        @first-page="firstPage"
        @prev-page="prevPage"
        @next-page="nextPage"
        @latest-page="latestPage"
        @btn-page="btnPage"
      />
    </template>
  </section>
  <UIModal
    ref="deleteModalRef"
    title="{{ t('page_notes.delete_title') }}"
    class="page-note__modal"
  >
    <template #default>
      <div class="page-note__modal-form delete-note-form">
        <h3>{{ t('page_notes.delete_confirm_text') }}</h3>
      </div>
    </template>
    <template #actions="{ close, confirm }">
      <UiButton @click="close" :label="t('page_notes.cancel')" />
      <UiButton @click="confirm" :label="t('page_notes.delete_button')" />
    </template>
  </UIModal>
  <UIModal
    ref="editModalRef"
    :title="t('page_notes.update_title')"
    class="page-note__modal"
  >
    <ItemForm
      ref="editFormRef"
      :title="editingNote?.title"
      :description="editingNote?.description"
    />
    <template #actions="{ close }">
      <UiButton @click="close" :label="t('page_notes.cancel')" />
      <UiButton @click="updateNote" :label="t('page_notes.update_button')" />
    </template>
  </UIModal>
  <UIModal
    ref="createModalRef"
    :title="t('page_notes.create_title')"
    class="page-note__modal"
  >
    <ItemForm ref="createFormRef" />
    <template #actions="{ close }">
      <UiButton @click="close" :label="t('page_notes.cancel')" />
      <UiButton @click="createNote" :label="t('page_notes.create_button')" />
    </template>
  </UIModal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNoteStore } from '@/plugins/store/note'
import NoteItem from '@/components/NoteItem.vue'
import UIPagination from '@/components/ui/UiPagination.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'
import ItemForm from '@/components/forms/ItemForm.vue'
import UiPaginationMobile from '@/components/ui/UiPaginationMobile.vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import { type Note } from '../types/notes'
import { useInjectWindowResize } from '@/composables/useWindowResize'
import { useNote } from '@/composables/useNote'
import { usePaginatedRoute } from '@/composables/usePaginatedRoute'
import { AppError } from '@/types/app-errors'
import { useLoading } from '@/composables/useLoading'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const createFormRef = ref()
const editFormRef = ref()

const deleteModalRef = ref<IModalOpen | null>(null)
const editModalRef = ref<IModalOpen | null>(null)
const createModalRef = ref<IModalOpen | null>(null)

const editingNote = ref<Note | undefined>(undefined)

const { isMobile, isTablet } = useInjectWindowResize()

const noteStore = useNoteStore()
const { rows, pages } = storeToRefs(noteStore)
const { getAll, update, create, remove } = useNote()

const {
  pagination,
  firstPage,
  prevPage,
  nextPage,
  latestPage,
  btnPage,
  setPages,
  saveQuery,
  requestParams,
} = usePaginatedRoute(pages)

const { loading } = useLoading()

const submitWithModal = async (
  modal: IModalOpen | null,
  action: () => Promise<unknown>,
) => {
  const res = await action()
  if (!(res instanceof AppError)) {
    modal?.confirm(true)
  }
}

const openEditForm = async (note: Note) => {
  editingNote.value = note
  await editModalRef.value?.open()
  editingNote.value = undefined
}

const openCreateForm = () => {
  createModalRef.value?.open()
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

watch(
  pages,
  (pages) => {
    if (!pages) return
    setPages(pages)
  },
  { immediate: true },
)

watch(requestParams, (params) => {
  getAll(params)
  saveQuery()
})

onMounted(() => {
  getAll(requestParams.value)
  saveQuery()
})
</script>

<style scoped lang="scss">
.page-note {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: rem(32);

  &__title {
    text-align: center;
  }

  &__create {
    margin: 0 auto;
  }

  &__notes {
    padding-top: rem(60);
    display: grid;
    gap: rem(30);
  }

  &__modal-form {
    display: flex;
    flex-direction: column;
    gap: rem(8);
  }
}

@include media-query('tablet') {
  .page-note__notes {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

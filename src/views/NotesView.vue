<template>
  <section class="page-note">
    <h2 class="page-note__title">This is Notes page</h2>
    <UiButtonIcon
      class="page-note__create"
      iconName="plus"
      @click="createHandler"
    />
    <section class="page-note__notes">
      <NoteItem
        v-for="[id, note] of [...notesMap.entries()]"
        :key="id"
        :note="note"
        @editHandler="editHandler"
        @deleteHandler="deleteHandler"
      />

      <p v-if="!notes.length">Epmty notes</p>
    </section>

    <UIModal ref="deleteModalRef" title="Delete note?" class="page-note__modal">
      <template #default>
        <div class="page-note__modal-form delete-note-form">
          <h3>Are you sure you want to delete note?</h3>
        </div>
      </template>
      <template #actions="{ close, confirm }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="confirm" label="Delete note" />
      </template>
    </UIModal>
    <UIModal ref="editModalRef" title="Update note" class="page-note__modal">
      <template #default>
        <div class="page-note__modal-form update-note-form">
          <h3>Edit note</h3>
          <UiInput
            v-model="note.title"
            type="text"
            placeholder="Title"
            :validation="v$.title"
          />
          <UiTextarea
            v-model="note.description"
            placeholder="Description"
            :validation="v$.description"
          />
        </div>
      </template>
      <template #actions="{ close }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="updateNote" label="Update todo" />
      </template>
    </UIModal>
    <UIModal ref="createModalRef" title="Create Note" class="page-note__modal">
      <template #default>
        <div class="page-note__modal-form update-note-form">
          <h3>Create note</h3>
          <UiInput
            v-model="note.title"
            type="text"
            placeholder="Title"
            :validation="v$.title"
          />
          <UiTextarea
            v-model="note.description"
            placeholder="Description"
            :validation="v$.description"
          />
        </div>
      </template>
      <template #actions="{ close }">
        <UiButton @click="close" label="Cancel" />
        <UiButton @click="createNote" label="Create note" />
      </template>
    </UIModal>

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
import { onMounted, ref, reactive, computed, watch } from 'vue'
import { required, helpers } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { APP_CONFIG } from '@/constants'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNotesStore } from '@/plugins/store/notes'
import NoteItem from '@/components/NoteItem.vue'
import { usePagination } from '@/hooks/pagination'
import UIPagination from '@/components/ui/UiPagination.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import UiInput from '@/components/ui/fields/UiInput.vue'
import UiButton from '@/components/ui/buttons/UiButton.vue'

import UIModal, { type IModalOpen } from '@/components/ui/modals/UiModal.vue'
import {
  type UpdateNoteDTO,
  type ReplaceNoteDTO,
  type Note,
} from '../types/notes'
import UiTextarea from '@/components/ui/fields/UiTextarea.vue'

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = APP_CONFIG

const deleteModalRef = ref<IModalOpen | null>(null)
const editModalRef = ref<IModalOpen | null>(null)
const createModalRef = ref<IModalOpen | null>(null)

const route = useRoute()
const router = useRouter()

const note = reactive({
  title: '',
  description: '',
} as ReplaceNoteDTO)

const rules = {
  title: { required: helpers.withMessage('Title is required', required) },
  description: {
    required: helpers.withMessage('Description is required', required),
  },
}

const v$ = useVuelidate(rules, note)

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
const { notes, notesMap, pages } = storeToRefs(notesStore)
const { getAll, update, create, remove } = notesStore

const requestParams = computed(() => {
  const { perPage, page } = pagination
  return {
    perPage,
    page,
  }
})

const deleteHandler = async (note: Note) => {
  const { id } = note
  const modal = deleteModalRef.value
  const res = await modal?.open()
  if (res) remove(id)
}

const editHandler = async (_note: Note) => {
  fillInputs(_note)
  router.replace({ query: { ...route.query, id: _note.id } })
  const modal = editModalRef.value
  await modal?.open()
  const { id, ...restQuery } = route.query
  router.replace({ query: restQuery })
  clearInputs()
  v$.value.$reset()
}

const updateNote = async () => {
  const id = route.query.id
  const modal = editModalRef.value
  const isValid = await v$.value.$validate()
  if (!isValid || !id) return

  await update(Number(id), note)
  modal?.confirm(true)
}

const createHandler = async () => {
  const modal = createModalRef.value
  await modal?.open()
  clearInputs()
  v$.value.$reset()
}

const createNote = async () => {
  const modal = createModalRef.value
  const isValid = await v$.value.$validate()
  if (!isValid) return

  await create(note)
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

const clearInputs = () => {
  note.title = ''
  note.description = ''
}

const fillInputs = (_note: UpdateNoteDTO) => {
  note.title = _note.title ?? ''
  note.description = _note.description ?? ''
}

watch(
  pages,
  (pages) => {
    if (!pages) return
    setPages(pages)
  },
  { immediate: true }
)
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
  getAll(requestParams.value)
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

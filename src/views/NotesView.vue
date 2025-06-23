<template>
  <section class="page-note">
    <h2>This is Notes page</h2>
    <UiButtonIcon iconName="plus" @click="createHandler" />
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
    </UIModal>
    <UIModal ref="editModalRef" title="Update note" class="page-note__modal">
      <template #default>
        <div class="page-note__modal-form update-note-form">
          <h3>Edit note</h3>
          <input type="text" v-model="note.title" />
          <input type="text" v-model="note.description" />
        </div>
      </template>
    </UIModal>
    <UIModal ref="createModalRef" title="Create Note" class="page-note__modal">
      <template #default>
        <div class="page-note__modal-form update-note-form">
          <h3>Create note</h3>
          <input type="text" v-model="note.title" />
          <input type="text" v-model="note.description" />
        </div>
      </template>
    </UIModal>

    <UIPagination
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
  import { useNotesStore } from '@/plugins/store/notes';
  import NoteItem from '@/components/NoteItem.vue';
  import { usePagination } from '@/hooks/pagination';
  import UIPagination from '@/components/UiPagination.vue';
  import UiButtonIcon from '@/components/UiButtonIcon.vue';

  import UIModal, { type IModalOpen } from '@/components/UiModal.vue';
  import { type UpdateNoteDTO, type ReplaceNoteDTO, type Note } from '../types/notes';

  const note = reactive({
    title: '',
    description: '',
  } as ReplaceNoteDTO);

  const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = APP_CONFIG;

  const deleteModalRef = ref<IModalOpen | null>(null);
  const editModalRef = ref<IModalOpen | null>(null);
  const createModalRef = ref<IModalOpen | null>(null);

  const route = useRoute();
  const router = useRouter();

  const notesStore = useNotesStore();
  const { pagination, firstPage, prevPage, nextPage, latestPage, btnPage, setPages } =
    usePagination(DEFAULT_PAGE_SIZE);
  const { notes, notesMap, pages } = storeToRefs(notesStore);
  const { getAll, update, create, remove } = notesStore;

  const requestParams = computed(() => {
    const { perPage, page } = pagination;
    return {
      perPage,
      page,
    };
  });

  const deleteHandler = async (note: Note) => {
    const { id } = note;
    const modal = deleteModalRef.value;
    const res = await modal?.open();
    if (res) remove(id);
  };

  const editHandler = async (_note: Note) => {
    const { id } = _note;
    fillInputs(_note);
    const modal = editModalRef.value;
    const res = await modal?.open();
    if (res) {
      update(id, note);
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
      create(note);
    }
    clearInputs();
  };

  const completeHandler = ({ id, payload }: { id: number; payload: UpdateNoteDTO }) => {
    update(id, payload);
  };

  const clearInputs = () => {
    note.title = '';
    note.description = '';
  };

  const fillInputs = (_note: UpdateNoteDTO) => {
    note.title = _note.title ?? '';
    note.description = _note.description ?? '';
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
  .page-note {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    &__notes {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: center;
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

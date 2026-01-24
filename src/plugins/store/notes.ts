import { inject, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import { AppError } from '@/types/app-errors';
import type { CreateNoteDTO, Note, UpdateNoteDTO } from '@/types/notes';
import type { GetAllParams } from '@/types/app.types';
import type { Application } from '@/application/application';
import { errorMsg } from '@/helpers/formatErrorMsg';
import type { WSMessage } from '@/application/services/ws.service';


export const useNotesStore = defineStore('notes', () => {
  const rows: Ref<Note[]> = ref([])
  const indexID = ref(new Map<number, Note>())
  const total = ref<number>(0)
  const pages = ref<number>(0)
  let currentPage = 0

  const application = inject('application') as Application

  function messageHandler(message: WSMessage) {
    switch (message.event) {
      case 'create':
        _create(message.data)
        break
      case 'update':
        _update(message.data)
        break
      case 'delete':
        _delete(message.data)
        break
    }
  }

  async function getAll(params: GetAllParams) {
    try {
      const { data, total: _total, pages: _pages } = await application.getAllNotes(params)
      rows.value = data.map(note => {
        indexID.value.set(note.id, note)
        return note
      })
      total.value = _total
      pages.value = _pages
      currentPage = params.page ?? 1
    } catch (error) {
      rows.value = []
      indexID.value = new Map()
      total.value = 0
      pages.value = 0
      application.notify('error', errorMsg(error))
    }
  }

  function _update(
    note: Note,
  ): void {
    const _todo = indexID.value.get(note.id)
    if (!_todo) {
      return
    }
    Object.assign(_todo, note)
  }

  function _create(
    note: Note,
  ): void {
    indexID.value.set(note.id, note)
    if (currentPage === 1) {
      rows.value.unshift(note)
    }
    total.value++
  }

  function _delete(
    id: number,
  ): void {
    const _todo = indexID.value.get(id)
    if (!_todo) {
      return
    }
    rows.value = rows.value.filter(({ id }) => id !== _todo.id)
    indexID.value.delete(_todo.id)
  }


  async function update(_id: number, payload: UpdateNoteDTO) {
    const res = await application.updateNote(_id, payload)
    if (res instanceof AppError) {
      return res
    }
  }

  async function create(payload: CreateNoteDTO) {
    const res = await application.createNote(payload)
    if (res instanceof AppError) {
      return res
    }
  }

  async function remove(id: number) {
    const res = await application.deleteNote(id)
    if (res instanceof AppError) {
      return res
    }
  }

  return { getAll, rows, indexID, update, create, remove, total, pages, messageHandler }
})
import { inject, ref } from 'vue'
import { defineStore } from 'pinia'

import { AppError } from '@/types/app-errors';
import type { CreateNoteDTO, Note, UpdateNoteDTO } from '@/types/notes';
import type { GetAllParams } from '@/types/app.types';
import type { Application } from '@/application/application';
import { errorMsg } from '@/helpers/formatErrorMsg';
import type { WSMessage } from '@/application/services/ws.service';


export const useNotesStore = defineStore('notes', () => {


  const notesMap = ref(new Map<number, Note>())
  const total = ref<number>(0)
  const pages = ref<number>(1)

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
      notesMap.value = new Map(data.map(note => [note.id, note]))
      total.value = _total
      pages.value = _pages
    } catch (error) {
      notesMap.value = new Map()
      total.value = 0
      pages.value = 1
      application.notify('error', errorMsg(error))
    }
  }

  function _update(
    data: any,
  ): void {
    notesMap.value.set(data.id, data)
  }

  function _create(
    data: any,
  ): void {
    notesMap.value.set(data.id, data)
  }

  function _delete(
    id: number,
  ): void {
    notesMap.value.delete(id)
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

  return { getAll, notesMap, update, create, remove, total, pages, messageHandler }
})
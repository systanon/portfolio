import { inject, ref } from 'vue'
import { defineStore } from 'pinia'

import { AppError } from '@/types/app-errors';
import type { CreateNoteDTO, Note, UpdateNoteDTO } from '@/types/notes';
import type { GetAllParams } from '@/types/app.types';
import type { Application } from '@/application/application';


export const useNotesStore = defineStore('notes', () => {

  const notes = ref<Note[]>([])
  const notesMap = ref(new Map<number, Note>())
  const total = ref<number>(0)
  const pages = ref<number>(1)

  const application = inject('application') as Application

  async function getAll(params: GetAllParams) {
    try {
      const { data, total: _total, pages: _pages } = await application.getAllNotes(params)
      notes.value = data
      notesMap.value = new Map(data.map(note => [note.id, note]))
      total.value = _total
      pages.value = _pages
    } catch (error) {
      console.error(error)
    }
  }

  async function update(_id: number, payload: UpdateNoteDTO) {
    const _payload = { ...payload }
    const res = await application.updateNote(_id, payload)
    if (res instanceof AppError) {
      console.warn(res)
    } else {
      const note = notes.value.find(t => t.id === _id)
      if (note) Object.assign(note, _payload)

      const mapTodo = notesMap.value.get(_id)
      mapTodo && Object.assign(mapTodo, _payload)
    }
  }

  async function create(payload: CreateNoteDTO) {
    const res = await application.createNote(payload)
    if (res instanceof AppError) {
      console.warn(res)
    } else {
      const note = await application.getOneNote(res)
      if (note instanceof AppError) {
        console.warn(res)
      } else {
        notes.value.push(note)
        notesMap.value.set(note.id, note)
      }
    }
  }

  async function remove(id: number) {
    const res = await application.deleteNote(id)
    if (res instanceof AppError) {
      console.warn(res)
    } else {
      const index = notes.value.findIndex((note) => note.id === id)
      if (index !== -1) {
        notes.value.splice(index, 1)
      }
      notesMap.value.delete(id)
    }
  }

  return { getAll, notes, notesMap, update, create, remove, total, pages }
})
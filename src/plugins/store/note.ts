import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

import type { Note } from '@/types/notes'
import type { WSMessage } from '@/application/services/ws.service'

type InsertData = {
  notes: Note[]
  total: number
  pages: number
  currentPage: number
}
export const useNoteStore = defineStore('note', () => {
  const rows: Ref<Note[]> = ref([])
  const indexID = ref(new Map<number, Note>())
  const total = ref<number>(0)
  const pages = ref<number>(0)
  let currentPage = 0

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

  async function addAll(data: InsertData) {
    rows.value = data.notes.map((note) => {
      indexID.value.set(note.id, note)
      return note
    })
    total.value = data.total
    pages.value = data.pages
    currentPage = data.currentPage
  }

  function _update(note: Note): void {
    const _todo = indexID.value.get(note.id)
    if (!_todo) {
      return
    }
    Object.assign(_todo, note)
  }

  function _create(note: Note): void {
    indexID.value.set(note.id, note)
    if (currentPage === 1) {
      rows.value.unshift(note)
    }
    total.value++
  }

  function _delete(id: number): void {
    const _todo = indexID.value.get(id)
    if (!_todo) {
      return
    }
    rows.value = rows.value.filter(({ id }) => id !== _todo.id)
    indexID.value.delete(_todo.id)
  }

  return {
    addAll,
    rows,
    indexID,
    total,
    pages,
    messageHandler,
  }
})

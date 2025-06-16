<template>
  <div ref="note" class="note-item">
    <div class="note-item__info">
      <h2 class="note-item__title">{{ note.title }}</h2>
      <p class="note-item__description">{{ note.description }}</p>
    </div>
    <div class="note-item__actions">
      <button @click="$emit('editHandler', note)">edit</button>
      <button @click="$emit('deleteHandler', note)">remove</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Note } from "@/types/notes";
import { defineProps } from "vue";
defineProps<{
  note: Note;
}>();
</script>

<style scoped lang="scss">
.note-item {
  box-sizing: border-box;
  padding: 4rem;
  border-radius: 2rem;
  border: black solid 1px;
  display: flex;
  gap: 1rem;
  width: 30rem;
  min-height: 10rem;
  &__checked {
    display: flex;
    align-items: center;
    flex: 0 0;
  }
  &__info {
    flex: 1 1;
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 0 0;
  }
  &__title {
    margin: 0;
  }
}
</style>

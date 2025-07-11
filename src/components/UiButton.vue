<template>
  <button :disabled="disabled" class="ui-button" :type="type">
    <slot name="prepend"></slot>
    <span class="ui-button__content">
      <slot name="default">
        {{ label }}
      </slot>
    </span>
    <slot name="append"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  name: 'UiButton',
  props: {
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<'button' | 'submit' | 'reset'>,
      default: 'button',
    },
  },
})
</script>

<style lang="scss" scoped>
.ui-button {
  background: transparent;
  border: none;
  color: var(--text-color-secondary);
  text-align: center;
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  border-radius: rem(6);
  transition: box-shadow 0.4s ease;
  &__content {
    font-size: 1.25rem;
  }
  &:hover {
    box-shadow: 0 0 10px var(--todo-checked), 0 0 20px var(--todo-checked),
      0 0 30px var(--todo-checked);
  }
  &:disabled {
    opacity: 0.2;
    pointer-events: none;
  }
}
</style>

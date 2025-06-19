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
  import { defineComponent, type PropType } from 'vue';

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
  });
</script>

<style lang="scss" scoped>
  .ui-button {
    background: transparent;
    border: none;
    color: transparent;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      opacity: 1;
    }
    &:disabled {
      opacity: 0.2;
      pointer-events: none;
    }
  }
</style>

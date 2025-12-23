<template>
  <button :disabled="disabled" class="ui-button-icon">
    <slot name="prepend"></slot>
    <UIIcon :name="iconName" />
    <slot name="append"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UIIcon from '@/components/ui/icons/UiIcon.vue'

export default defineComponent({
  components: { UIIcon },
  name: 'UiButtonIcon',
  props: {
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    iconName: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
.ui-button-icon {
  padding: rem(16);
  border: none;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  background-color: transparent;
  font-size: rem(18);
  border-radius: rem(6);
  gap: rem(10);
  &:hover {
    box-shadow: var(--btn-shadow);
  }
  &:disabled {
    pointer-events: none;
    opacity: $disabled-opacity;
  }
}
</style>

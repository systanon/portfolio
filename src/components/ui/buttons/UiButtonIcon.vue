<template>
  <button
    :disabled="disabled"
    :class="[
      'ui-button-icon',
      { '_icon-hover': iconHover, '_btn-hover': btnHover },
    ]"
  >
    <slot name="prepend"></slot>
    <UIIcon :name="iconName" :size="iconSize" :color="iconColor" />
    <slot name="append"></slot>
  </button>
</template>

<script lang="ts" setup>
import UIIcon from '@/components/ui/icons/UiIcon.vue'
import type { IconColor, IconSize } from '@/components/ui/icons/UiIcon.vue'

defineOptions({
  name: 'UiButtonIcon',
})

defineSlots<{
  prepend(): any
  append(): any
}>()

withDefaults(
  defineProps<{
    iconName: string
    disabled?: boolean
    iconSize?: IconSize
    iconHover?: boolean
    btnHover?: boolean
    iconColor?: IconColor
  }>(),
  {
    disabled: false,
    iconHover: false,
    btnHover: true,
  },
)
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
  &._btn-hover {
    &:hover {
      box-shadow: var(--btn-shadow);
    }
  }
  &:disabled {
    pointer-events: none;
    opacity: $disabled-opacity;
  }
  &._icon-hover {
    &:hover {
      :deep(.ui-icon) {
        color: var(--icon-hover-primary);
      }
    }
  }
}
</style>

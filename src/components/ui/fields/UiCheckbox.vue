<template>
  <BaseField :id="id" :label="label" :validation="validation">
    <label class="ui-checkbox">
      <input
        v-bind="$attrs"
        type="checkbox"
        class="ui-checkbox__input"
        :id="id"
        :checked="modelValue"
        :disabled="disabled"
        @change="onChange"
      />
      <span class="ui-checkbox__text">
        <slot>{{ label }}</slot>
      </span>
    </label>
  </BaseField>
</template>

<script setup lang="ts">
import BaseField from '@/components/ui/fields/BaseField.vue'
import type { BaseValidation } from '@vuelidate/core'

interface Props {
  modelValue: boolean
  id?: string
  label?: string
  disabled?: boolean
  validation?: BaseValidation
}

defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}
</script>

<style scoped lang="scss">
.ui-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;

  &__input {
    width: 1.1rem;
    height: 1.1rem;
    cursor: pointer;
    accent-color: $bg-menu-secondary;
    margin: 0;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__text {
    font-size: 1rem;
    color: var(--text-color-secondary);
  }
}
</style>

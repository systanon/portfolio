<template>
  <BaseField :label="label" :validation="validation">
    <template #default="{ id }">
      <textarea
        v-bind="$attrs"
        :id="id"
        v-model="modelValueProxy"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'ui-textarea__field',
          { 'ui-textarea__field--error': $v?.$error },
        ]"
        @blur="$v?.$touch()"
      />
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import BaseField from '@/components/ui/fields/BaseField.vue'
import type { BaseValidation } from '@vuelidate/core'
import { useField } from '@/composables/useField'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  validation?: BaseValidation
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { modelValueProxy, $v } = useField(props, emit)
</script>

<style scoped lang="scss">
.ui-textarea {
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--text-color-secondary);
  padding-bottom: 1.2rem;

  &__field {
    padding: 1rem;
    border: 1px solid $border-color;
    border-radius: 6px;
    font-size: rem(18);
    width: 100%;
    min-height: 6rem;
    resize: vertical;

    &--error {
      border-color: $error-color;
    }
    &:disabled {
      color: var(--text-color-secondary);
    }
  }
}
</style>

<template>
  <BaseField :label="label" :validation="validation">
    <template #default="{ id }">
      <input
        v-bind="$attrs"
        :id="id"
        v-model="modelValueProxy"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{ 'ui-input__field--error': $v?.$error }"
        class="ui-input__field"
        @blur="$v?.$touch()"
      />

      <UiButtonIcon
        v-if="iconName"
        :iconName="iconName"
        @click="$emit('iconClick')"
        class="ui-input__icon"
      />
    </template>
  </BaseField>
</template>

<script setup lang="ts">
import type { BaseValidation } from '@vuelidate/core'
import BaseField from '@/components/ui/fields/BaseField.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import { useField } from '@/composables/useField'

interface Props {
  modelValue: string
  label?: string
  iconName?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  validation?: BaseValidation
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'iconClick'): void
}>()

const { modelValueProxy, $v } = useField(props, emit)
</script>

<style scoped lang="scss">
.ui-input__field {
  padding: 1rem 2.25rem 1rem 1rem;
  border: 1px solid $border-color;
  border-radius: 6px;
  font-size: rem(18);
  width: 100%;

  &--error {
    border-color: $error-color;
  }

  &:disabled {
    color: var(--text-color-secondary);
  }
}

.ui-input__icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  color: var(--todo-checked);
}
</style>

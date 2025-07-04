<template>
  <div class="ui-input">
    <label v-if="label" :for="id" class="ui-input__label">{{ label }}</label>
    <div class="ui-input__wrapper">
      <input
        :id="id"
        v-model="modelValueProxy"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{ 'ui-input__field--error': $v?.$error }"
        class="ui-input__field"
        @blur="$v?.$touch()"
      />
      <template v-if="iconName" class="ui-input__icon">
        <UiButtonIcon :iconName="iconName" @click="$emit('iconClick')" />
      </template>
    </div>
    <p v-show="$v?.$error" class="ui-input__error">
      <span
        class="ui-input__error-text"
        v-for="error in errorMessages"
        :key="error"
        >{{ error }}</span
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import type { BaseValidation } from '@vuelidate/core'
import UiButtonIcon from './UiButtonIcon.vue'

interface Props {
  modelValue: string
  label?: string
  iconName?: string
  placeholder?: string
  type?: string
  id?: string
  disabled?: boolean
  validation?: BaseValidation
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'iconClick'): void
}>()

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const $v = props.validation

const errorMessages = computed(() => {
  if (!$v || !$v.$errors) return []
  return $v.$errors.map((err) => unref(err.$message))
})
</script>

<style scoped lang="scss">
.ui-input {
  position: relative;
  display: flex;
  flex-direction: column;
  color: var(--text-color-secondary);
  padding-bottom: 1.2rem;

  &__label {
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
  &__wrapper {
    position: relative;
    width: 100%;
  }

  &__field {
    padding: 0.5rem 2.25rem 0.5rem 0.5rem;
    border: 1px solid $border-color;
    border-radius: 6px;
    font-size: 1rem;
    width: 100%;

    &--error {
      border-color: $error-color;
    }
    &:disabled {
      color: var(--text-color-secondary);
    }
  }

  :deep(.ui-button-icon) {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  &__error {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.875rem;
    &-text {
      color: $error-color;
    }
  }
  :deep(.ui-icon) {
    color: var(--todo-checked);
  }
}
</style>

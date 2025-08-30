<template>
  <div class="ui-textarea">
    <label v-if="label" :for="id" class="ui-textarea__label">{{ label }}</label>
    <div class="ui-textarea__wrapper">
      <textarea
        :id="id"
        v-model="modelValueProxy"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{ 'ui-textarea__field--error': $v?.$error }"
        class="ui-textarea__field"
        @blur="$v?.$touch()"
      />
    </div>
    <p v-show="$v?.$error" class="ui-textarea__error">
      <span
        class="ui-textarea__error-text"
        v-for="error in errorMessages"
        :key="error"
      >
        {{ error }}
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, unref } from 'vue'
import type { BaseValidation } from '@vuelidate/core'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  id?: string
  disabled?: boolean
  validation?: BaseValidation
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
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
.ui-textarea {
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

  &__error {
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: 0.875rem;
    &-text {
      color: $error-color;
    }
  }
}
</style>

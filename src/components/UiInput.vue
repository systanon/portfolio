<template>
  <div class="ui-input">
    <label v-if="label" :for="id" class="ui-input__label">{{ label }}</label>
    <input
      :id="id"
      v-model="modelValueProxy"
      :type="type"
      :placeholder="placeholder"
      :class="{ 'ui-input__field--error': $v?.$error }"
      class="ui-input__field"
      @blur="$v?.$touch()"
    />
    <p v-show="$v?.$error" class="ui-input__error">
      <span v-for="error in errorMessages" :key="error">{{ error }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
  import { computed, unref } from 'vue';
  import type { ErrorObject } from '@vuelidate/core';
  type FieldValidation = {
    readonly $model: unknown;
    readonly $dirty: boolean;
    readonly $error: boolean;
    readonly $errors: ErrorObject[];
    readonly $touch: () => void;
    readonly $validate: () => Promise<boolean>;
  };
  interface Props {
    modelValue: string;
    label?: string;
    placeholder?: string;
    type?: string;
    id?: string;
    validation?: FieldValidation;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const modelValueProxy = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  });

  const $v = props.validation;

  const errorMessages = computed(() => {
    if (!$v || !$v.$errors) return [];
    return $v.$errors.map((err) => unref(err.$message));
  });
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

    &__field {
      padding: 0.5rem;
      border: 1px solid $border-color;
      border-radius: 6px;
      font-size: 1rem;

      &--error {
        border-color: $error-color;
      }
    }

    &__error {
      color: $error-color;
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 0.875rem;
    }
  }
</style>

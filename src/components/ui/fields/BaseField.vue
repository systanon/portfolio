<template>
  <div class="base-field">
    <label v-if="label" :for="id" class="base-field__label">
      {{ label }}
    </label>

    <div class="base-field__control">
      <slot :id="id" />
    </div>

    <p v-show="$v?.$error" class="base-field__error">
      <span
        class="base-field__error-text"
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
import { v4 as uuidv4 } from 'uuid'

interface Props {
  label?: string
  validation?: BaseValidation
}

defineOptions({ inheritAttrs: false })

const id = computed(() => uuidv4())

const props = defineProps<Props>()

const $v = props.validation

const errorMessages = computed(() => {
  if (!$v || !$v.$errors) return []
  return $v.$errors.map((err) => unref(err.$message))
})
</script>

<style scoped lang="scss">
.base-field {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 1.2rem;

  &__label {
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: var(--text-color-secondary);
  }

  &__control {
    position: relative;
    width: 100%;
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

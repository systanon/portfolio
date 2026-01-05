import { computed } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { useField } from './useField'
import { createValidationMock } from '@/tests/utils/createValidationMock'


describe('useField', () => {
  it('returns modelValueProxy with correct getter', () => {
    const props = { modelValue: 'hello' }
    const emit = vi.fn()

    const { modelValueProxy } = useField(props, emit)

    expect(modelValueProxy.value).toBe('hello')
  })

  it('emits update:modelValue when setting modelValueProxy', () => {
    const props = { modelValue: 'initial' }
    const emit = vi.fn()

    const { modelValueProxy } = useField(props, emit)

    modelValueProxy.value = 'updated'

    expect(emit).toHaveBeenCalledWith('update:modelValue', 'updated')
  })

  it('returns validation object as $v', () => {
    const { validation } = createValidationMock()
    const props = { modelValue: 'x', validation }
    const emit = vi.fn()

    const { $v } = useField(props, emit)

    expect($v).toBe(validation)
  })

  it('works with computed modelValue', () => {
    const model = computed(() => 'computed-value')
    const props = { modelValue: model.value }
    const emit = vi.fn()

    const { modelValueProxy } = useField(props, emit)

    expect(modelValueProxy.value).toBe('computed-value')
  })
})

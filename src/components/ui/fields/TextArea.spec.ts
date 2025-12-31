import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TextArea from '@/components/ui/fields/UiTextarea.vue'
import type { BaseValidation } from '@vuelidate/core'
import { ref } from 'vue'

describe('TextArea.vue', () => {
  it('renders the textarea with the passed value', () => {
    const wrapper = mount(TextArea, {
      props: { modelValue: 'Initial text' },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect((textarea.element as HTMLTextAreaElement).value).toBe('Initial text')
  })

  it('renders the label if provided', () => {
    const wrapper = mount(TextArea, {
      props: { label: 'Describe', modelValue: '' },
    })
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Describe')
  })

  it('updates the value via v-model', async () => {
    const model = ref('')
    const wrapper = mount(TextArea, {
      props: {
        modelValue: model.value,
        'onUpdate:modelValue': (val: string) => (model.value = val),
      },
    })
    const textarea = wrapper.find('textarea')
    await textarea.setValue('New text')
    expect(model.value).toBe('New text')
  })

  it('displays validation errors', () => {
    const validation = {
      $errors: [{ $message: 'Required field' }],
      $error: true,
    } as unknown as BaseValidation

    const wrapper = mount(TextArea, {
      props: { modelValue: '', validation },
    })
    const error = wrapper.find('.base-field__error-text')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Required field')
  })

  it('does not display errors when there are none', () => {
    const validation = {
      $errors: [],
      $error: false,
    } as unknown as BaseValidation
    const wrapper = mount(TextArea, {
      props: { modelValue: '', validation },
    })
    const error = wrapper.find('.ui-textarea__error-text')
    expect(error.exists()).toBe(false)
  })

  it('calls $touch on blur', async () => {
    const $touch = vi.fn()
    const validation = {
      $touch,
      $errors: [],
      $error: false,
    } as unknown as BaseValidation
    const wrapper = mount(TextArea, {
      props: { modelValue: '', validation },
    })
    const textarea = wrapper.find('textarea')
    await textarea.trigger('blur')
    expect($touch).toHaveBeenCalled()
  })
})

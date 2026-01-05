import { computed } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UiInput from './UiInput.vue'
import BaseField from '@/components/ui/fields/BaseField.vue'
import UiButtonIcon from '@/components/ui/buttons/UiButtonIcon.vue'
import { createValidationMock } from '@/tests/utils/createValidationMock'



vi.mock('@/composables/useField', () => ({
  useField: (props: any, emit: any) => ({
    modelValueProxy: computed({
      get: () => props.modelValue,
      set: (v: string) => emit('update:modelValue', v)
    }),
    $v: { $error: true }
  })
}))

describe('UiInput', () => {
  it('renders BaseField with label and validation', () => {
    const { validation } = createValidationMock()
    const wrapper = mount(UiInput, {
      props: { modelValue: '', label: 'Email', validation }
    })

    const baseField = wrapper.findComponent(BaseField)
    expect(baseField.exists()).toBe(true)
    expect(baseField.props('label')).toBe('Email')
    expect(baseField.props('validation')).toStrictEqual(validation)
  })

  it('renders input with correct attributes', () => {
    const wrapper = mount(UiInput, {
      props: {
        modelValue: '',
        placeholder: 'Enter text',
        type: 'email',
        disabled: true
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Enter text')
    expect(input.attributes('type')).toBe('email')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('emits update:modelValue when typing', async () => {
    const wrapper = mount(UiInput, {
      props: { modelValue: '' }
    })

    const input = wrapper.find('input')
    await input.setValue('hello')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hello'])
  })

  it('emits blur event on blur', async () => {
    const wrapper = mount(UiInput, {
      props: { modelValue: '' }
    })

    const input = wrapper.find('input')
    await input.trigger('blur')

    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('renders icon button when iconName is provided', () => {
    const wrapper = mount(UiInput, {
      props: { modelValue: '', iconName: 'search' }
    })

    const icon = wrapper.findComponent(UiButtonIcon)
    expect(icon.exists()).toBe(true)
    expect(icon.props('iconName')).toBe('search')
  })

  it('emits iconClick when icon is clicked', async () => {
    const wrapper = mount(UiInput, {
      props: { modelValue: '', iconName: 'search' }
    })

    const icon = wrapper.findComponent(UiButtonIcon)
    await icon.trigger('click')

    expect(wrapper.emitted('iconClick')).toBeTruthy()
  })

  it('applies error class when validation has error', () => {
    const wrapper = mount(UiInput, {
      props: { modelValue: '' }
    })

    const input = wrapper.find('input')
    expect(input.classes()).toContain('ui-input__field--error')
  })
})

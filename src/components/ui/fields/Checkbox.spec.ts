import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UiCheckbox from '@/components/ui/fields/UiCheckbox.vue'

function factory(props?: Record<string, unknown>, attrs?: Record<string, unknown>) {
  return mount(UiCheckbox, {
    props: {
      modelValue: false,
      label: 'Test label',
      ...props,
    },
    attrs,
  })
}

describe('UiCheckbox', () => {
  it('renders label text', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('Test label')
  })

  it('renders slot instead of label when provided', () => {
    const wrapper = mount(UiCheckbox, {
      props: { modelValue: false },
      slots: { default: 'Custom slot text' },
    })

    expect(wrapper.text()).toContain('Custom slot text')
  })

  it('passes id from BaseField slot to input', () => {
    const wrapper = factory()
    const input = wrapper.find('input[type="checkbox"]')

    expect(input.attributes('id')).toBeTruthy()
  })

  it('binds modelValue to checked state', () => {
    const wrapper = factory({ modelValue: true })
    const input = wrapper.find('input')

    expect(input.element.checked).toBe(true)
  })

  it('emits update:modelValue and change on input change', async () => {
    const wrapper = factory()
    const input = wrapper.find('input')

    await input.setValue(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  it('disables input when disabled prop is true', () => {
    const wrapper = factory({ disabled: true })
    const input = wrapper.find('input')

    expect(input.attributes('disabled')).toBeDefined()
  })

  it('forwards attrs to input', () => {
    const wrapper = factory({}, { 'data-test': 'checkbox' })
    const input = wrapper.find('input')

    expect(input.attributes('data-test')).toBe('checkbox')
  })
})

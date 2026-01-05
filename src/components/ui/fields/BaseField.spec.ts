import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseField from './BaseField.vue'
import { createValidationMock } from '@/tests/utils/createValidationMock'

describe('BaseField', () => {
  it('renders label when provided', () => {
    const wrapper = mount(BaseField, {
      props: { label: 'Email' },
      slots: { default: () => '<input />' }
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Email')
  })

  it('does not render label when not provided', () => {
    const wrapper = mount(BaseField, {
      slots: { default: () => '<input />' }
    })

    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('passes generated id to slot content', () => {
    const wrapper = mount(BaseField, {
      props: { label: 'Name' },
      slots: {
        default: ({ id }) => h('input', { id })
      }
    })

    const input = wrapper.find('input')
    const label = wrapper.find('label')

    expect(input.exists()).toBe(true)
    expect(label.attributes('for')).toBe(input.attributes('id'))
  })

  it('does not show error block when no validation provided', () => {
    const wrapper = mount(BaseField, {
      slots: { default: () => '<input />' }
    })

    expect(wrapper.find('.base-field__error').isVisible()).toBe(false)
  })

  it('shows error messages when validation has errors', async () => {
    const { validation, setErrors } = createValidationMock()


    const wrapper = mount(BaseField, {
      props: { validation },
      slots: { default: () => '<input />' }
    })

    setErrors(['Required', 'Invalid format'])

    await wrapper.vm.$nextTick()

    const errors = wrapper.findAll('.base-field__error-text')

    expect(errors.length).toBe(2)
    expect(errors[0].text()).toBe('Required')
    expect(errors[1].text()).toBe('Invalid format')
  })

  it('reactively updates error messages', async () => {
    const { validation, setErrors } = createValidationMock()

    const wrapper = mount(BaseField, {
      props: { validation },
      slots: { default: () => '<input />' }
    })

    expect(wrapper.find('.base-field__error').isVisible()).toBe(false)

    setErrors(['Required'])
    await wrapper.vm.$nextTick()

    const errors = wrapper.findAll('.base-field__error-text')
    expect(errors.length).toBe(1)
    expect(errors[0].text()).toBe('Required')
  })
})

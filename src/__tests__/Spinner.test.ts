import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SpinnerComponent from '../components/shared/Spinner.component.vue'

describe('SpinnerComponent', () => {
  it('renders when enabled is true', () => {
    const wrapper = mount(SpinnerComponent, {
      props: { enabled: true }
    })
    expect(wrapper.find('.bg-loader').exists()).toBe(true)
    expect(wrapper.find('.loader').exists()).toBe(true)
  })

  it('does not render when enabled is false', () => {
    const wrapper = mount(SpinnerComponent, {
      props: { enabled: false }
    })
    expect(wrapper.find('.bg-loader').exists()).toBe(false)
  })
})

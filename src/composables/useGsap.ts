import { getCurrentInstance } from 'vue'
import type gsap from 'gsap'

export const useGsap = () => {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useGsap must be called inside setup()')
  }

  return instance.appContext.config.globalProperties.$gsap as typeof gsap
}

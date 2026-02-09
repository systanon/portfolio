import { onUnmounted } from 'vue'

let lockCount = 0
let scrollY = 0

export function useScrollLock() {
  const lock = () => {
    if (lockCount === 0) {
      scrollY = window.scrollY

      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
    }

    lockCount++
  }

  const unlock = () => {
    if (lockCount === 0) return

    lockCount--

    if (lockCount === 0) {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''

      window.scrollTo(0, scrollY)
    }
  }

  onUnmounted(() => {
    unlock()
  })

  return {
    lock,
    unlock,
  }
}

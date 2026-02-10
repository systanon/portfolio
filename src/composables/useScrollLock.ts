import { ref, onUnmounted } from 'vue'

let globalLockCount = 0

export function useScrollLock() {
  const isLocked = ref(false)

  const lock = () => {
    if (isLocked.value) return

    if (globalLockCount === 0) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth

      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    globalLockCount++
    isLocked.value = true
  }

  const unlock = () => {
    if (!isLocked.value) return

    globalLockCount--
    isLocked.value = false

    if (globalLockCount === 0) {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }

  onUnmounted(unlock)

  return { lock, unlock }
}

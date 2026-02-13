import type { gsap as GSAPType } from 'gsap'

export const iconAnimation = (gsap: typeof GSAPType) => {
  return () => {
    const onEnter = (e: MouseEvent) => {
      gsap.to(e.currentTarget, {
        scale: 1.2,
        duration: 0.25,
        ease: 'power2.out',
      })
    }
    const onLeave = (e: MouseEvent) => {
      gsap.to(e.currentTarget, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
      })
    }
    return {
      onEnter,
      onLeave,
    }
  }
}

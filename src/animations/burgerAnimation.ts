import type { gsap as GSAPType } from 'gsap'

export const burgerAnimation = (gsap: typeof GSAPType) => {
  return (lines: HTMLElement[]) => {
    const tl: gsap.core.Timeline = gsap.timeline({ paused: true })
    const init = () => {
      tl.to(lines[0], { top: '50%', y: '-50%', rotate: 45, duration: 0.2 }, 0)
        .to(lines[1], { opacity: 0, duration: 0.2 }, 0)
        .to(
          lines[2],
          { bottom: '50%', y: '50%', rotate: -45, duration: 0.2 },
          0,
        )
    }
    return {
      init,
      play: () => tl.play(),
      reverse: () => tl.reverse(),
      kill: () => tl.kill(),
    }
  }
}

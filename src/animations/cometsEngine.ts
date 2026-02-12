import { calculateTarget } from '@/utils/calculateTarget'
import type { gsap as GSAPType } from 'gsap'

const MAX_COMETS = 3
const DELAYED_CALL = 2

export type Comet = {
  id: number
  startX: number
  startY: number
  angle: number
  duration: number
}

type Listener = (comets: Comet[]) => void

export class CometsEngine {
  private gsap: typeof GSAPType
  private cometRefs: Map<number, HTMLElement> = new Map()
  private spawnTween: gsap.core.Tween | null = null
  private timelines: Map<number, gsap.core.Timeline> = new Map()
  private comets: Comet[] = []
  private cometId: number = 0
  private listeners: Set<Listener> = new Set()
  private isRunning: boolean = false

  constructor(gsap: typeof GSAPType) {
    this.gsap = gsap
  }

  public subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private notify() {
    this.listeners.forEach((fn) => fn([...this.comets]))
  }

  public registerCometElement(id: number, comet: HTMLElement) {
    this.cometRefs.set(id, comet)
  }

  start() {
    this.isRunning = true
    this.scheduleSpawn()
  }

  stop() {
    this.isRunning = false
    this.spawnTween?.kill()

    this.timelines.forEach((tl) => tl.kill())
    this.timelines.clear()

    this.comets = []
    this.cometRefs.clear()

    this.notify()
  }

  private scheduleSpawn() {
    if (!this.isRunning) return
    this.spawnTween = this.gsap.delayedCall(DELAYED_CALL, () => {
      if (this.comets.length < MAX_COMETS) {
        this.spawnComet()
      }
      this.scheduleSpawn()
    })
  }

  private spawnComet() {
    const comet: Comet = {
      id: this.cometId++,
      startX: Math.random() * window.innerWidth * 0.8,
      startY: -50,
      angle: 30 + Math.random() * 30,
      duration: 2 + Math.random() * 2,
    }

    this.comets.push(comet)
    this.notify()

    requestAnimationFrame(() => {
      if (!this.isRunning) return
      this.animateComet(comet)
    })
  }

  private animateComet(comet: Comet) {
    const element = this.cometRefs.get(comet.id)
    if (!element) return

    const tail = element.querySelector<HTMLElement>('.comets-field__tail')
    const { x, y } = calculateTarget(comet.startX, comet.startY, comet.angle)

    this.gsap.set(element, {
      x: comet.startX,
      y: comet.startY,
      rotation: comet.angle,
    })

    if (tail) {
      this.gsap.set(tail, {
        width: 0,
        opacity: 0.8,
        scaleX: 1,
        transformOrigin: 'right center',
        xPercent: -100,
      })
    }

    const tl = this.gsap.timeline({
      onComplete: () => {
        this.comets = this.comets.filter((c) => c.id !== comet.id)
        this.cometRefs.delete(comet.id)
        this.timelines.delete(comet.id)
        this.notify()
      },
    })

    this.timelines.set(comet.id, tl)

    tl.to(element, { x, y, duration: comet.duration, ease: 'power1.in' }, 0)
    if (tail) {
      tl.to(
        tail,
        {
          width: 150 + Math.random() * 100,
          opacity: 0,
          duration: comet.duration,
          ease: 'power1.in',
        },
        0,
      )
    }
  }
}

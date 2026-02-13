import gsap from 'gsap'
import { CometsEngine } from './cometsEngine'
import { ModalEngine } from './modalEngine'
import { pulseAnimation } from './pulseAnimation'
import { burgerAnimation } from './burgerAnimation'
import { navBarAnimation } from './navBarAnimation'
import { iconAnimation } from './iconAnimation'
import { progressAnimation } from './progressAnimation'
import { textAssemblyAnimation } from './textAssemblyAnimation'
import { textSoftRevealAnimation } from './testSoftRevealAnimation'

export const cometsEngine = new CometsEngine(gsap)
export const modalEngine = new ModalEngine(gsap)

export const createBurger = burgerAnimation(gsap)
export const createNavBar = navBarAnimation(gsap)
export const createIcon = iconAnimation(gsap)
export const createPulse = pulseAnimation(gsap)
export const createProgress = progressAnimation(gsap)
export const createTextAssembly = textAssemblyAnimation(gsap)
export const createTextSoftReveal = textSoftRevealAnimation(gsap)

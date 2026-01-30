import type { App } from 'vue'
import gsap from 'gsap'

export default {
  install(app: App) {
    app.config.globalProperties.$gsap = gsap
  },
}

import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import App from './App.vue'
import { router } from './plugins/router'
import { createStore } from './plugins/store'

import { application } from './application'

import '@/sass/_theme.scss'
import 'floating-vue/dist/style.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('SW registration failed:', err)
    })
  })
}

const app = createApp(App)

app.use(createStore(application))

app.use(router)

app.use(FloatingVue)

application.run()

application.on('unlogged', router.checkAccessCurrentRoute)

application.on('redirect', (routeName) => {
  router.push({ name: routeName })
})

application.on('logged', router.checkAccessCurrentRoute)

app.mount('#app')

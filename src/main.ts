import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './plugins/router'
import { application, wSService } from './application'

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


app.provide('application', application)

app.use(createPinia())

app.use(router)

app.use(FloatingVue)

application.run()

application.on('unlogged', router.checkAccessCurrentRoute)

application.on('redirect', (routeName) => {
  router.push({ name: routeName })
})

application.on('logged', async (user_id: number) => {
  router.checkAccessCurrentRoute()

  await wSService.waitForConnection()

  wSService.auth('auth', user_id)
})

app.mount('#app')

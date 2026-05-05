import { createApp } from 'vue'
import FloatingVue from 'floating-vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './plugins/router'
import { application } from './application'
import { setupSyncListener } from './application/listeners/sync.listener'
import { i18n } from './i18n'

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
app.use(i18n)

application.init()
setupSyncListener()

app.mount('#app')

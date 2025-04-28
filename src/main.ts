import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './plugins/router'
import { createStore } from './plugins/store'

import { application } from './application'
import { delay } from './helpers/delay'

const app = createApp(App)

app.use(createStore(application))
app.use(router)


const bootstrap = async () => {
  try {
    await application.run()
  } catch (error) {
    console.error('Run application error', error)
  } finally {
    app.mount('#app')
    await delay(500)
    document.getElementById('global-loader')?.remove()
  }
}

bootstrap()
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './plugins/router'
import { createStore } from './plugins/store'

import { application } from './application'

const app = createApp(App)

app.use(createStore(application))
app.use(router)

application.run()
app.mount('#app')
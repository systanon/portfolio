import { createApp } from 'vue'
import App from './App.vue'
import { router } from './plugins/router'
import { createStore } from './plugins/store'

import { application } from './application'

import '@/sass/_reset.scss'
import '@/sass/_theme.scss'

const app = createApp(App)

app.use(createStore(application))

app.use(router)

application.run()

application.on("unlogged", router.checkAccessCurrentRoute)

application.on("logged", router.checkAccessCurrentRoute)

app.mount('#app')
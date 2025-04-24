import { createPinia } from 'pinia'
import type { PiniaPluginContext } from 'pinia'
import { Application } from '@/application/application'
import { markRaw } from 'vue'
import { router } from '../router'

export const applicationPiniaPlugin = (application: Application) => (ctx: PiniaPluginContext) => {
  ctx.pinia // the pinia created with `createPinia()`
  ctx.app // the current app created with `createApp()`
  ctx.store // the store the plugin is augmenting
  ctx.options // the options object defining the store passed to `defineStore()`

  ctx.store.$subscribe(() => {
    // react to store changes
  })
  ctx.store.$onAction(() => {
    // react to store actions
  })

  const set = new Set<string>()
  set.add('application')
  set.add('router')
  ctx.store._customProperties = set

  ctx.store.application = markRaw(application)
  ctx.store.router = markRaw(router)
}

export const createStore = (application: Application) => {
  const store = createPinia()
  store.use(applicationPiniaPlugin(application))
  return store
}

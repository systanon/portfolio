import { createApp, type Plugin } from 'vue'

export function withSetup<T>(composable: () => T, plugins: Plugin[] = []): T {
  let result: T

  const app = createApp({
    setup() {
      result = composable()
      return () => {}
    },
  })

  plugins.forEach((p) => app.use(p))
  app.mount(document.createElement('div'))

  return result!
}

export const delay = (ms: number) =>
  new Promise<void>((resolve) => setInterval(resolve, ms))

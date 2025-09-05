import { delay } from '@/helpers/delay'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info'

export interface NotificationPayload {
  id: number
  type: NotificationType
  message: string
}

export class NotificationService {
  notifications = ref<Map<number, NotificationPayload>>(new Map())
  #counter = 0

  async notify(type: NotificationType, message: string) {
    const id = this.#counter++
    const payload = { id, type, message }
    this.notifications.value.set(id, payload)

    await delay(5000)
    this.remove(id)
  }

  remove(id: number) {
    this.notifications.value.delete(id)
  }
  clear() {
    this.notifications.value.clear()
  }
}

import { notificationModule } from '@/application'

export function useNotifications() {
  const { notifications } = notificationModule

  function remove(id: number) {
    notificationModule.remove(id)
  }

  return {
    notifications,
    remove,
  }
}

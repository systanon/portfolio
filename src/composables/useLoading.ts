import { computed } from 'vue'
import { application } from '@/application'

export function useLoading() {
  const loading = computed(() => {
    return application.loading
  })
  return {
    loading
  }
}
import { application } from "@/application"
import { computed } from "vue"


export function useLogged() {

  const isLogged = computed(() => {
    return application.isLogged
  })
  return {
    isLogged
  }
}
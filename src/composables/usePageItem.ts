import { computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { APP_CONFIG } from '@/constants'
import { useRoute, useRouter } from 'vue-router'
import type { RouteName } from '@/types/router'
import { usePagination } from '@/hooks/pagination'
import { AppError } from '@/types/app-errors'
import type { IModalOpen } from '@/components/ui/modals/UiModal.vue'
import { wSService } from '@/application'
import type { WSMessage } from '@/application/services/ws.service'


export function usePageItem(
  getAll: (params: any) => void,
  pages: Ref<number, number>,
  topic: string,
  wsCb: (params: WSMessage) => void,
  routeName: RouteName = 'TodoDetail'
) {
  const route = useRoute()
  const router = useRouter()
  const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = APP_CONFIG
  const unsubscribe = wSService.subscribe(topic, wsCb)

  const {
    pagination,
    firstPage,
    prevPage,
    nextPage,
    latestPage,
    btnPage,
    setPages,
  } = usePagination(DEFAULT_PAGE_SIZE)

  const details = (id: number) => {
    router.push({
      name: routeName satisfies RouteName,
      params: { id },
    })
  }

  const submitWithModal = async (
    modal: IModalOpen | null,
    action: () => Promise<unknown>,
  ) => {
    const res = await action()
    if (!(res instanceof AppError)) {
      modal?.confirm(true)
    }
  }

  const requestParams = computed(() => {
    const { perPage, page } = pagination
    return { perPage, page }
  })

  const parseQuery = () => {
    pagination.page = Number(route.query.page) || DEFAULT_PAGE
    pagination.perPage = Number(route.query.perPage) || DEFAULT_PAGE_SIZE
  }

  const saveQuery = () => {
    router.replace({
      query: { ...route.query, ...requestParams.value },
    })
  }

  watch(
    pages,
    (pages) => {
      if (!pages) return
      setPages(pages)
    },
    { immediate: true },
  )

  watch(requestParams, (params) => {
    getAll(params)
    saveQuery()
  })

  onMounted(() => {
    parseQuery()
    getAll(requestParams.value)
  })

  onUnmounted(() => {
    unsubscribe()
  })
  return {
    parseQuery,
    details,
    pagination,
    firstPage,
    prevPage,
    nextPage,
    latestPage,
    btnPage,
    setPages,
    submitWithModal
  }
}
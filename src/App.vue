<script lang="ts" setup>
import GlobalLoader from '@/components/GlobalLoader.vue'
import Notifications from '@/components/Notifications.vue'
import { useWindowResize } from './composables/useWindowResize'
import { useLocale } from '@/composables/useLocale'
import { ref } from 'vue'

useWindowResize()
const { resolveAndApply } = useLocale()

const ready = ref(false)

resolveAndApply().then(() => {
  ready.value = true
})
</script>

<template>
  <router-view />
  <GlobalLoader />
  <Notifications />
</template>
